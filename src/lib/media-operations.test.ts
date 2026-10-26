import { describe, expect, it, vi } from "vitest"
import { stagePrivateMediaChange } from "./media-operations"

const success = { error: null }
const failure = (message: string) => ({ error: { message } })

describe("stagePrivateMediaChange", () => {
  it("persists staged uploads without removing them on success", async () => {
    const undoStage = vi.fn().mockResolvedValue(success)
    const result = await stagePrivateMediaChange({
      stage: vi.fn().mockResolvedValue(success),
      persist: vi.fn().mockResolvedValue(success),
      undoStage,
    })
    expect(result.ok).toBe(true)
    expect(undoStage).not.toHaveBeenCalled()
  })

  it("removes a staged upload if the metadata insert fails", async () => {
    const undoStage = vi.fn().mockResolvedValue(success)
    const result = await stagePrivateMediaChange({
      stage: vi.fn().mockResolvedValue(success),
      persist: vi.fn().mockResolvedValue(failure("database unavailable")),
      undoStage,
    })
    expect(result.ok).toBe(false)
    expect(result.message).toContain("revertido")
    expect(undoStage).toHaveBeenCalledOnce()
  })

  it("does not persist or clean up when staging itself fails", async () => {
    const persist = vi.fn().mockResolvedValue(success)
    const undoStage = vi.fn().mockResolvedValue(success)
    const result = await stagePrivateMediaChange({
      stage: vi.fn().mockResolvedValue(failure("upload failed")),
      persist,
      undoStage,
    })
    expect(result.ok).toBe(false)
    expect(persist).not.toHaveBeenCalled()
    expect(undoStage).not.toHaveBeenCalled()
  })

  it("retains previous media on metadata failure", async () => {
    const cleanupOld = vi.fn().mockResolvedValue(success)
    const undoStage = vi.fn().mockResolvedValue(success)
    const result = await stagePrivateMediaChange({
      stage: vi.fn().mockResolvedValue(success),
      persist: vi.fn().mockResolvedValue(failure("update failed")),
      undoStage,
      cleanupOld,
    })
    expect(result.ok).toBe(false)
    expect(undoStage).toHaveBeenCalledOnce()
    expect(cleanupOld).not.toHaveBeenCalled()
  })

  it("cleans previous media only after metadata success", async () => {
    const order: string[] = []
    const result = await stagePrivateMediaChange({
      stage: async () => {
        order.push("stage")
        return success
      },
      persist: async () => {
        order.push("persist")
        return success
      },
      undoStage: async () => success,
      cleanupOld: async () => {
        order.push("cleanup-old")
        return success
      },
    })
    expect(result.ok).toBe(true)
    expect(order).toEqual(["stage", "persist", "cleanup-old"])
  })

  it("reports failed cleanup while preserving a successful metadata update", async () => {
    const result = await stagePrivateMediaChange({
      stage: vi.fn().mockResolvedValue(success),
      persist: vi.fn().mockResolvedValue(success),
      undoStage: vi.fn().mockResolvedValue(success),
      cleanupOld: vi.fn().mockResolvedValue(failure("storage temporarily unavailable")),
    })
    expect(result.ok).toBe(true)
    expect(result.warning).toContain("arquivo anterior")
  })

  it("reports when compensation cannot remove the staged file", async () => {
    const result = await stagePrivateMediaChange({
      stage: vi.fn().mockResolvedValue(success),
      persist: vi.fn().mockResolvedValue(failure("insert failed")),
      undoStage: vi.fn().mockResolvedValue(failure("remove failed")),
    })
    expect(result.ok).toBe(false)
    expect(result.message).toContain("arquivo temporário não removido")
  })
})
