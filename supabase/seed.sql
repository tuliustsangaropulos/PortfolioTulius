-- Idempotent editorial seed. Run after 202610220001_portfolio_cms.sql.
insert into public.pages (slug, title, seo_title, seo_description, status, published_at)
values ('home', 'Tulius Tsangaropulos', 'Tulius Tsangaropulos — Comunicação e Estratégia',
  'Portfólio e trajetória profissional em comunicação corporativa, jornalismo, reputação e estratégia.', 'published', now())
on conflict (slug) do update set title = excluded.title, seo_title = excluded.seo_title, seo_description = excluded.seo_description;

insert into public.site_settings(site_title, locale, description, seo_json, status)
select 'Tulius Tsangaropulos', 'pt-BR',
  'Portfólio e trajetória profissional em comunicação corporativa, jornalismo, reputação e estratégia.',
  '{"robots":"index,follow","fontHeading":"Big Shoulders Display","fontBody":"Inter"}'::jsonb,
  'published'
where not exists(select 1 from public.site_settings);

with p as (select id from public.pages where slug = 'home')
insert into public.sections (page_id, slug, title, eyebrow, intro, sort_order, layout_variant, theme, status, is_visible, published_at)
select p.id, v.slug, v.title, v.eyebrow, v.intro, v.ord, v.layout, v.theme, 'published', true, now()
from p cross join (values
  ('perfil','Tulius Tsangaropulos','Comunicação Corporativa e Institucional · Coordenação de Comunicação · RP, Reputação, Assessoria e Estratégia Digital','Foco em gerar conexões autênticas e projetos inovadores.',1,'hero','paper'),
  ('sobre','Olá!','Prazer, sou o Tulius','Jornalista e profissional sênior de Comunicação e Marketing, com mais de 15 anos de experiência em empresas globais, imprensa, agências e setor público.',2,'editorial','orange'),
  ('resultados','Resultados e projetos em destaque',null,'Indicadores documentados nas experiências profissionais.',3,'metrics','paper'),
  ('competencias','Comunicação e estratégia',null,null,4,'editorial','cream'),
  ('formacao','Formação',null,null,5,'timeline','paper'),
  ('invest-rs','Invest RS','Gestão de eventos, comunicação institucional e projetos digitais','Analista Executivo · Julho/2026 – atual · Porto Alegre, RS',6,'timeline','ink'),
  ('prefeitura-sp','Prefeitura de São Paulo','Comunicação institucional, interna e digital','Coordenador de Comunicação · Nov/2024 – jan/2026 · São Paulo, SP',7,'metrics','paper'),
  ('vale','Vale','Comunicação corporativa global e estratégia digital','Analista Sênior de Comunicação · Jun/2020 – out/2024',8,'metrics','cream'),
  ('globo-sportv','TV Globo / SporTV','Correspondente internacional','Trainee, Repórter, Produtor, Editor e Correspondente · 2015–2019',9,'timeline','ink'),
  ('inpress','Grupo InPress','Assessoria de imprensa, relações públicas e gestão de contas','Analista de Comunicação e Atendimento Sênior · Nov/2019 – jun/2020',10,'timeline','cream'),
  ('cdi','CDI Comunicação','Planejamento estratégico e comunicação institucional','Analista de Comunicação e Atendimento Pleno · Nov/2014 – set/2015',11,'timeline','paper'),
  ('ferramentas','Ferramentas',null,null,12,'editorial','cream'),
  ('depoimentos','Depoimentos',null,null,13,'quotes','paper'),
  ('contato','Contato','Vamos criar conexões autênticas?','Tulius Tsangaropulos · Comunicação, estratégia e reputação',14,'contact','orange')
) as v(slug,title,eyebrow,intro,ord,layout,theme)
on conflict (page_id, slug) do update set
  title=excluded.title, eyebrow=excluded.eyebrow, intro=excluded.intro, sort_order=excluded.sort_order,
  layout_variant=excluded.layout_variant, theme=excluded.theme;

insert into public.design_tokens (token_key, token_value, value_type, scope, status) values
  ('color.orange','#FF5414','color','global','published'),
  ('color.ink','#171617','color','global','published'),
  ('color.paper','#FAFAFA','color','global','published'),
  ('color.cream','#F8F4F1','color','global','published'),
  ('color.muted','#514742','color','global','published'),
  ('color.orangeDark','#BC390C','color','global','published')
on conflict (token_key) do update set token_value=excluded.token_value, status='published';

insert into public.design_tokens (token_key, token_value, value_type, scope, status) values
  ('font.heading','Big Shoulders Display','font','global','published'),
  ('font.body','Inter','font','global','published'),
  ('layout.container','1680','size','global','published'),
  ('space.section','64','space','global','published'),
  ('radius.card','4','radius','global','published'),
  ('motion.duration','520','motion','global','published')
on conflict (token_key) do update set token_value=excluded.token_value, status='published';

insert into public.navigation_items(label,target_slug,group_name,sort_order,is_visible,status)
select title,slug,
  case when sort_order <= 5 then 'Perfil' when sort_order <= 11 then 'Experiência' else 'Referências' end,
  sort_order,true,'published'
from public.sections
where page_id=(select id from public.pages where slug='home')
and not exists(select 1 from public.navigation_items n where n.target_slug=sections.slug);

-- Two blocks per section are the single content source placed in mobile A/B.
with payload(slug, a, b) as (values
('perfil',
'[{"title":"+15 ANOS","label":"Experiência","text":"de experiência em Comunicação, Marketing e Conteúdo","image":"/media/tulius-portrait-dark.jpg","alt":"Retrato em preto e branco de Tulius Tsangaropulos","hero":{"panelBackground":"#171617","badgeText":"VISÃO 360° DA COMUNICAÇÃO ·","badgeVisible":true,"badgeBackground":"#FF5414","badgeColor":"#171617","introColor":"#FFFFFF","desktop":{"visualHeight":45,"imageWidth":52,"imageHeight":100,"imagePositionX":50,"imagePositionY":0,"yearsX":50,"yearsY":10,"yearsWidth":43,"badgeSize":34,"badgeX":55,"badgeY":74,"contentGap":10},"mobile":{"imageWidth":46,"imageHeight":100,"imagePositionX":50,"imagePositionY":0,"badgeSize":28,"badgeX":5,"badgeY":72}}},{"title":"Experiência em grandes empresas","text":"TV Globo, Vale e Prefeitura de São Paulo","icon":"arrow"},{"title":"Experiência internacional","text":"Correspondente na China; formação em Dublin (2011) e Buenos Aires (2024).","icon":"arrow"},{"title":"Liderança de equipes","text":"Relacionamento com stakeholders, planejamento e visão estratégica","icon":"arrow"},{"title":"Idiomas","text":"Inglês fluente e espanhol avançado","icon":"arrow"}]'::jsonb,
'[{"title":"Comunicação Corporativa","label":"01"},{"title":"Gestão e execução de projetos","label":"02"},{"title":"Relações públicas e gestão de eventos","label":"03"},{"title":"Marketing digital, branding e performance","label":"04"},{"title":"Imprensa e influenciadores","label":"05"},{"title":"Invest RS","meta":"Porto Alegre · 2026","text":"Gestão de Eventos · Comunicação Institucional · Relações Públicas · Inovação Digital"},{"title":"Prefeitura de São Paulo","meta":"2024–2026","text":"Liderança de Equipes · Imprensa · Gestão de Crise · Estratégia Digital · Comunicação Interna · Media Training"},{"title":"Vale","meta":"São Paulo · 2020–2024","text":"Comunicação Corporativa Global · Comunicação Executiva · Gestão de Projetos · Campanhas Digitais · Reputação"},{"title":"Grupo InPress","meta":"São Paulo · 2019–2020","text":"Assessoria de Imprensa · Relações Públicas · Gestão de Contas · Comunicação Integrada"},{"title":"TV Globo/SporTV","meta":"Rio de Janeiro, Pequim e São Paulo · 2015–2019","text":"Jornalismo · Correspondência Internacional · Produção · Reportagem · Edição"},{"title":"CDI Comunicação","meta":"São Paulo · 2014–2015","text":"Planejamento Estratégico · Comunicação Institucional · Relações Públicas · Stakeholders"}]'::jsonb),
('sobre',
'[{"title":"Estratégia também é escuta.","text":"Uma trajetória conectando organizações e pessoas.","image":"/media/tulius-portrait.jpg","alt":"Retrato de Tulius Tsangaropulos"}]'::jsonb,
'[{"title":"Comunicação de ponta a ponta","text":"Conecto estratégia, reputação, conteúdo, tecnologia e gestão de projetos."},{"title":"Visão editorial","text":"Clareza para temas complexos, repertório internacional e execução orientada por contexto."}]'::jsonb),
('resultados',
'[{"title":"Mídia e Estratégia","label":"01","value":"R$ 12 milhões","text":"Orçamento anual de mídia paga gerido na Vale."},{"title":"Comunicação Pública","label":"02","value":"+48% · +225%","text":"Crescimento de seguidores e alcance em seis meses."},{"title":"Jornalismo Internacional","label":"03","value":"~8 mil","text":"Candidatos no processo que selecionou oito repórteres."},{"title":"Relações Públicas e Imprensa","label":"04","value":"+30","text":"Veiculações em veículos de primeira linha."}]'::jsonb,
'[{"title":"Estratégia de comunicação"},{"title":"Gestão de resultados"},{"title":"Comunicação digital"},{"title":"Conteúdo e reputação"},{"title":"Relações públicas e imprensa"},{"title":"Comunicação executiva"},{"title":"XXXXX · X/Y/Z","text":"Conteúdo provisório preservado para revisão editorial.","placeholder":true}]'::jsonb),
('competencias',
'[{"title":"Habilidades","text":"Planejamento estratégico e comunicação executiva."},{"title":"Gestão","text":"Gestão de equipes, projetos, reputação e indicadores."}]'::jsonb,
'[{"title":"Competências","text":"Comunicação corporativa, interna e digital."},{"title":"Relações","text":"Assessoria de imprensa, relações públicas e gestão de crises."},{"title":"Destaques","text":"Mais de 15 anos na Vale, TV Globo/SporTV, Invest RS, agências e setor público."}]'::jsonb),
('formacao',
'[{"title":"Comunicação Social — Jornalismo","meta":"UFRN · 2007–2012","label":"Graduação"},{"title":"Comunicação Integrada e Marketing Digital","meta":"UnP · 2013","label":"Pós-graduação"},{"title":"Marketing Digital, BI e Estratégia Data Driven","meta":"PUCRS · 2020–2021","label":"MBA"}]'::jsonb,
'[{"title":"Swan Training Institute","meta":"Dublin · 2010–2011","label":"Inglês"},{"title":"Instituto Rojas","meta":"Buenos Aires · 2024","label":"Espanhol"}]'::jsonb),
('invest-rs',
'[{"title":"Competências aplicadas","tags":["Comunicação institucional","Projetos digitais","Relações públicas","Stakeholders","Gestão de eventos"]},{"title":"Guia de Boas-Vindas","text":"Organização editorial e estrutura de atualização."},{"title":"Organização de eventos","text":"Fornecedores, credenciamento, logística, materiais e cobertura."}]'::jsonb,
'[{"title":"Plataforma de eventos e relacionamento","text":"Eventos, convites, inscrições, check-in, segmentação e relatórios."},{"title":"Diagnóstico do mailing institucional","text":"Proposta de governança e fluxos; integrações permanecem planejadas."},{"title":"Cartões de visita digitais","text":"Variantes multilíngues, QR Code e vCard."},{"title":"Ativos visuais","text":"Imagens finais aguardam aprovação.","placeholder":true}]'::jsonb),
('prefeitura-sp',
'[{"title":"Planejamento de comunicação","label":"01","text":"Planejamento institucional, interno e digital."},{"title":"Conteúdo institucional e executivo","label":"02","text":"Notas oficiais, discursos e comunicados."},{"title":"Seguidores orgânicos","value":"+48%"},{"title":"Alcance de publicações","value":"+225%"},{"title":"Colaboradores no escopo","value":"900"}]'::jsonb,
'[{"title":"Imprensa e públicos estratégicos","label":"03","text":"Relacionamento com imprensa, órgãos, lideranças e cidadãos."},{"title":"Media training e reputação","label":"04","text":"Preparação de porta-vozes e gestão de crise."},{"title":"Plataforma SUBPI","text":"Portal concebido para cerca de 900 colaboradores."}]'::jsonb),
('vale',
'[{"title":"Orçamento anual de mídia sob gestão","value":"R$ 12 milhões"},{"title":"Equipe digital integrada","value":"6 pessoas"},{"title":"Projetos digitais de ponta a ponta","label":"01","text":"Planejamento, briefing, governança e coordenação."}]'::jsonb,
'[{"title":"Comunicação executiva e reputação","label":"02","text":"Conteúdo para CEO e vice-presidentes."},{"title":"Mídia paga e inteligência de dados","label":"03","text":"Otimização e relatórios executivos."},{"title":"Temas corporativos e inovação","label":"04","text":"ESG, diversidade, inclusão e tecnologia."}]'::jsonb),
('globo-sportv',
'[{"title":"Seleção nacional e formação","label":"01","text":"Selecionado entre cerca de 8 mil candidatos."},{"title":"Produção de ponta a ponta","label":"02","text":"Apuração, entrevistas, roteiro, gravação e edição."},{"title":"Televisão e plataformas digitais","label":"03","text":"TV Globo/SporTV e Globoesporte.com."}]'::jsonb,
'[{"title":"Cobertura e conteúdo editorial","label":"04","text":"Séries e coberturas esportivas e sociais."},{"title":"Jornalista em Pequim","label":"05","text":"Correspondente por cerca de um ano na China."},{"title":"Reportagens e entradas ao vivo","label":"06","text":"Entradas ao vivo e reportagens diárias."}]'::jsonb),
('inpress',
'[{"title":"Assessoria de imprensa","label":"01","text":"Mais de 30 veiculações em TV Globo, Folha, Veja, Exame e Forbes."},{"title":"Relações públicas","label":"02","text":"Jornalistas, influenciadores e porta-vozes."}]'::jsonb,
'[{"title":"Gestão de contas","label":"03","text":"GoPro, Johnson & Johnson e Sicredi."},{"title":"Campanhas integradas","label":"04","text":"Imprensa, influenciadores, eventos e ações digitais."}]'::jsonb),
('cdi',
'[{"title":"Planejamento estratégico","label":"01","text":"Planejamento anual, planos táticos e indicadores."},{"title":"Comunicação institucional","label":"02","text":"Roteiros, discursos e apresentações."}]'::jsonb,
'[{"title":"Relações públicas","label":"03","text":"Clientes como Sicredi e Instituto Vladimir Herzog."},{"title":"Gestão de stakeholders","label":"04","text":"Públicos estratégicos e porta-vozes."}]'::jsonb),
('ferramentas',
'[{"title":"Análise e indicadores","text":"GA4 · Search Console · KPIs · dashboards"},{"title":"Mídia e performance","text":"Meta Ads · segmentação · campanhas"},{"title":"CRM e monitoramento","text":"Salesforce · HubSpot · Sprinklr"}]'::jsonb,
'[{"title":"Projetos e colaboração","text":"Asana · Notion"},{"title":"Conteúdo e design","text":"Adobe Creative Cloud · Figma · WordPress"},{"title":"Comunicação digital","text":"Conteúdo · mídias sociais · campanhas"}]'::jsonb),
('depoimentos',
'[{"title":"Matheus Gomes","meta":"Estagiário · Subprefeitura de Pinheiros","image":"/media/matheus-gomes.jpg","text":"“Aprendi muito com ele no desenvolvimento do meu olhar jornalístico e na compreensão de uma comunicação mais estratégica, alinhada aos objetivos institucionais e ao interesse público. Sou muito grato ao Tulius pela oportunidade. Sem dúvida, é um profissional que inspira e ensina.”"},{"title":"Ana Beatriz Neves","meta":"Estagiária · Subprefeitura de Pinheiros","image":"/media/ana-beatriz-neves.jpg","text":"“Além de jornalista, Tulius se destaca pelo seu olhar voltado à inovação e à tecnologia. Para mim, ele foi também um verdadeiro professor nessa área, sempre disposto a compartilhar conhecimentos, explicar processos e apresentar novas ferramentas e possibilidades que ampliaram minha visão profissional.”"}]'::jsonb,
'[{"title":"Fábio Seixas","meta":"Chefe de Redação da TV Globo","image":"/media/fabio-seixas.jpg","text":"“Em meio a milhares de candidatos, Tulius foi um dos selecionados para o programa Passaporte SporTV. Destacou-se na fase de seleção e foi enviado à China durante os Jogos Olímpicos do Rio. É um profissional batalhador e cheio de iniciativa, que certamente vai crescer muito na carreira.”"}]'::jsonb),
('contato',
'[{"title":"Tulius Tsangaropulos","text":"Moinhos de Vento · Porto Alegre/RS","image":"/media/tulius-contact.jpg","alt":"Tulius Tsangaropulos segurando um tablet"}]'::jsonb,
'[{"title":"WhatsApp","value":"(51) 98992-6830","meta":"https://wa.me/5551989926830"},{"title":"E-mail","value":"tuliust@gmail.com","meta":"mailto:tuliust@gmail.com"},{"title":"LinkedIn","value":"linkedin.com/in/tuliust","meta":"https://linkedin.com/in/tuliust"}]'::jsonb)
)
insert into public.content_blocks(section_id,block_type,content_json,mobile_panel,sort_order,status,is_placeholder,editorial_note)
select s.id, case when s.slug='depoimentos' then 'quote' when s.slug='contato' then 'contact' else 'cards' end,
  jsonb_build_object('items', x.items), x.panel, case when x.panel='a' then 1 else 2 end, 'published',
  s.slug in ('resultados','invest-rs'), case when s.slug in ('resultados','invest-rs') then 'Contém item explicitamente pendente no material-fonte.' end
from payload p
join public.sections s on s.slug=p.slug and s.page_id=(select id from public.pages where slug='home')
cross join lateral (values ('a',p.a),('b',p.b)) x(panel,items)
where not exists(select 1 from public.content_blocks b where b.section_id=s.id and b.mobile_panel=x.panel);

insert into public.section_panels(section_id,breakpoint,panel_key,theme,sort_order,layout_variant)
select s.id, p.breakpoint, p.panel_key, 'inherit', p.sort_order, 'inherit'
from public.sections s
cross join (values
  ('desktop','desktop',1),
  ('mobile','mobile-a',1),
  ('mobile','mobile-b',2)
) p(breakpoint,panel_key,sort_order)
where s.page_id=(select id from public.pages where slug='home')
and not exists(
  select 1 from public.section_panels existing
  where existing.section_id=s.id and existing.panel_key=p.panel_key
);

insert into public.block_placements(block_id,panel_id,sort_order,layout_variant,motion_config,is_visible)
select b.id, p.id, b.sort_order, 'default',
  jsonb_build_object(
    'preset', case when b.block_type='media' then 'image-reveal' else 'fade-up' end,
    'duration', 520, 'delay', 0, 'distance', 18, 'once', true
  ), true
from public.content_blocks b
join public.section_panels p on p.section_id=b.section_id
where p.panel_key='desktop' or p.panel_key=case when b.mobile_panel='a' then 'mobile-a' else 'mobile-b' end
on conflict (block_id,panel_id) do nothing;

insert into public.career_experiences(company,role,location,start_date,end_date,description,sort_order,status,editorial_note) values
('Invest RS','Analista Executivo','Porto Alegre, RS','2026','atual','Eventos, comunicação institucional, relações públicas e inovação digital.',1,'published','Cargo diverge do Canva: Assessor Executivo | Núcleo de Comunicação.'),
('Prefeitura de São Paulo','Coordenador de Comunicação','São Paulo, SP','nov/2024','jan/2026','Comunicação institucional, interna e digital.',2,'published',null),
('Vale','Analista Sênior de Comunicação','São Paulo, SP','jun/2020','out/2024','Comunicação corporativa global e estratégia digital.',3,'published','Confirmar contexto de 6 pessoas versus 14 países.'),
('Grupo InPress','Analista de Comunicação e Atendimento Sênior','São Paulo, SP','nov/2019','jun/2020','Assessoria, relações públicas e gestão de contas.',4,'published','Cargo diverge entre fontes.'),
('TV Globo/SporTV','Trainee, Repórter, Produtor, Editor e Correspondente','Rio de Janeiro, Pequim e São Paulo','2015','2019','Jornalismo e correspondência internacional.',5,'published',null),
('CDI Comunicação','Analista de Comunicação e Atendimento Pleno','São Paulo, SP','nov/2014','set/2015','Planejamento e comunicação institucional.',6,'published','Descrição diverge entre fontes.')
on conflict (company,start_date) do update set
  role=excluded.role, location=excluded.location, end_date=excluded.end_date,
  description=excluded.description, sort_order=excluded.sort_order,
  status=excluded.status, editorial_note=excluded.editorial_note;

insert into public.education(institution,course,degree_type,start_date,end_date,sort_order,status) values
('Universidade Federal do Rio Grande do Norte (UFRN)','Comunicação Social — Jornalismo','Graduação','2007','2012',1,'published'),
('Universidade Potiguar (UnP)','Comunicação Integrada e Marketing Digital','Pós-graduação','2013','2013',2,'published'),
('Pontifícia Universidade Católica do Rio Grande do Sul (PUCRS)','Marketing Digital, BI e Estratégia Data Driven','MBA','2020','2021',3,'published')
on conflict (institution,course) do update set
  degree_type=excluded.degree_type,start_date=excluded.start_date,end_date=excluded.end_date,
  sort_order=excluded.sort_order,status=excluded.status;

insert into public.language_levels(language,level_label,evidence_note,sort_order,status,editorial_note) values
('Inglês','Fluente','Swan Training Institute · Dublin, Irlanda · 2010–2011',1,'published','Fonte alternativa descreve C1; revisar nomenclatura.'),
('Espanhol','Avançado','Instituto Rojas · Buenos Aires, Argentina · 2024',2,'published','Fonte alternativa descreve B2; revisar nomenclatura.')
on conflict (language) do update set
  level_label=excluded.level_label,evidence_note=excluded.evidence_note,
  sort_order=excluded.sort_order,status=excluded.status,editorial_note=excluded.editorial_note;

insert into public.skills(name,category,sort_order,status) values
('Planejamento estratégico','Estratégia',1,'published'),
('Comunicação executiva','Estratégia',2,'published'),
('Gestão de equipes e projetos','Gestão',3,'published'),
('Comunicação corporativa','Comunicação',4,'published'),
('Assessoria de imprensa','Comunicação',5,'published'),
('Relações públicas','Comunicação',6,'published'),
('Gestão de crise','Reputação',7,'published')
on conflict (name,category) do update set sort_order=excluded.sort_order,status=excluded.status;

insert into public.tool_categories(title,tools,sort_order,status) values
('Análise e indicadores','[{"name":"Google Analytics 4"},{"name":"Google Search Console"},{"name":"KPIs, dashboards e relatórios"}]'::jsonb,1,'published'),
('Mídia e performance','[{"name":"Meta Ads"},{"name":"Segmentação e gestão de campanhas"},{"name":"Monitoramento de resultados"}]'::jsonb,2,'published'),
('CRM e monitoramento','[{"name":"Salesforce"},{"name":"HubSpot"},{"name":"Sprinklr"}]'::jsonb,3,'published'),
('Projetos e colaboração','[{"name":"Asana"},{"name":"Notion"}]'::jsonb,4,'published'),
('Conteúdo e design','[{"name":"Adobe Creative Cloud"},{"name":"Figma"},{"name":"WordPress"}]'::jsonb,5,'published'),
('Comunicação digital','[{"name":"Conteúdo e mídias sociais"},{"name":"Comunicação institucional e executiva"}]'::jsonb,6,'published')
on conflict (title) do update set tools=excluded.tools,sort_order=excluded.sort_order,status=excluded.status;

insert into public.testimonials(author_name,author_role,quote_text,sort_order,status) values
('Matheus Gomes','Estagiário | Subprefeitura de Pinheiros','Aprendi muito com ele no desenvolvimento do meu olhar jornalístico e na compreensão de uma comunicação mais estratégica, alinhada aos objetivos institucionais e ao interesse público. Sou muito grato ao Tulius pela oportunidade. Sem dúvida, é um profissional que inspira e ensina.',1,'published'),
('Ana Beatriz Neves','Estagiária | Subprefeitura de Pinheiros','Além de jornalista, Tulius se destaca pelo seu olhar voltado à inovação e à tecnologia. Para mim, ele foi também um verdadeiro professor nessa área, sempre disposto a compartilhar conhecimentos, explicar processos e apresentar novas ferramentas e possibilidades que ampliaram minha visão profissional.',2,'published'),
('Fábio Seixas','Chefe de Redação da TV Globo','Em meio a milhares de candidatos, Tulius foi um dos selecionados para o programa Passaporte SporTV. Destacou-se na fase de seleção e foi enviado à China durante os Jogos Olímpicos do Rio. É um profissional batalhador e cheio de iniciativa, que certamente vai crescer muito na carreira.',3,'published')
on conflict (author_name) do update set
  author_role=excluded.author_role,quote_text=excluded.quote_text,
  sort_order=excluded.sort_order,status=excluded.status;

insert into public.contact_channels(channel_type,label,value,url,sort_order,status) values
('whatsapp','WhatsApp','(51) 98992-6830','https://wa.me/5551989926830',1,'published'),
('email','E-mail','tuliust@gmail.com','mailto:tuliust@gmail.com',2,'published'),
('linkedin','LinkedIn','linkedin.com/in/tuliust','https://linkedin.com/in/tuliust',3,'published'),
('location','Localização','Moinhos de Vento · Porto Alegre/RS',null,4,'published')
on conflict (channel_type) do update set
  label=excluded.label,value=excluded.value,url=excluded.url,
  sort_order=excluded.sort_order,status=excluded.status;

insert into public.metrics(section_id,label,value_text,unit,context,sort_order,status,editorial_note)
select s.id, m.label, m.value_text, m.unit, m.context, m.sort_order, 'published', m.note
from (values
  ('resultados','Orçamento anual de mídia','R$ 12 milhões',null,'Vale',1,null),
  ('resultados','Seguidores orgânicos','+48%','percentual','Prefeitura de São Paulo em seis meses',2,null),
  ('resultados','Alcance de publicações','+225%','percentual','Prefeitura de São Paulo em seis meses',3,null),
  ('resultados','Processo seletivo','~8 mil','candidatos','TV Globo/SporTV',4,null),
  ('resultados','Veiculações','+30','veiculações','Grupo InPress',5,null),
  ('vale','Equipe digital integrada','6','pessoas','Áreas e agências',1,'Confirmar contexto versus indicador de 14 países.')
) m(slug,label,value_text,unit,context,sort_order,note)
join public.sections s on s.slug=m.slug and s.page_id=(select id from public.pages where slug='home')
where not exists(select 1 from public.metrics existing where existing.section_id=s.id and existing.label=m.label);

insert into public.portfolio_projects(experience_id,title,summary,details,project_status,sort_order,status)
select e.id,p.title,p.summary,p.details,p.project_status,p.sort_order,'published'
from (values
  ('Invest RS','Guia de Boas-Vindas','Estrutura editorial para atualização do guia institucional','Apoio à integração de equipes.','editorial',1),
  ('Invest RS','Plataforma de eventos e relacionamento','Concepção de fluxo para convites, inscrições e check-in','Integrações externas permanecem planejadas.','proposta',2),
  ('Prefeitura de São Paulo','Plataforma SUBPI','Portal interno concebido para cerca de 900 colaboradores','Comunicados, informações institucionais, relatórios e indicadores.','concebido',1),
  ('Vale','Projetos digitais de ponta a ponta','Planejamento, briefing, governança e coordenação','Equipes internas, agências e plataformas.','realizado',1)
) p(company,title,summary,details,project_status,sort_order)
join public.career_experiences e on e.company=p.company
where not exists(select 1 from public.portfolio_projects existing where existing.experience_id=e.id and existing.title=p.title);

insert into public.editorial_issues(section_id,field_path,description,source_a,source_b)
select s.id, x.field_path, x.description, x.source_a, x.source_b
from (values
('invest-rs','role','Cargo divergente','Analista Executivo','Assessor Executivo | Núcleo de Comunicação'),
('formacao','languages','Nível de idiomas divergente','inglês fluente / espanhol avançado','inglês C1 / espanhol B2'),
('vale','metrics.secondary','Indicadores têm contextos diferentes','6 pessoas','14 países'),
('perfil','international','Contextos internacionais diferentes','viagens a 34 países','articulação com 14 países'),
('inpress','role','Cargo diverge entre fontes','PDF','Canva'),
('cdi','description','Descrição diverge entre fontes','PDF','Canva'),
('resultados','panelB.placeholder','Elementos provisórios','X/Y/Z/XXXXX',null),
('invest-rs','media','Imagens temporárias',null,null),
('depoimentos','layout.duplicates','Duplicações apenas gráficas no PDF','PDF',null)
) x(slug,field_path,description,source_a,source_b)
join public.sections s on s.slug=x.slug and s.page_id=(select id from public.pages where slug='home')
where not exists(select 1 from public.editorial_issues e where e.section_id=s.id and e.field_path=x.field_path);
