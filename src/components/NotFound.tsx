import { Link } from "react-router"
import { Icon } from "./ui/Icons"

export function NotFound() {
  return (
    <main className="not-found">
      <p>Erro 404</p>
      <h1>Esta página saiu da pauta.</h1>
      <Link to="/">
        Voltar ao portfólio <Icon name="arrow" />
      </Link>
    </main>
  )
}
