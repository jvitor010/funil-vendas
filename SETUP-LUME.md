# Lume · o que configurar para ligar login, pagamento e avisos

O código da Fase 2 está pronto e testado. Estes passos só você pode fazer, porque usam as suas contas. Faça na ordem; cada um diz exatamente o que copiar e para onde.

> Os endereços `https://www.fluxovital.top/api/...` só funcionam depois que a branch `feat/cjo-app` for publicada na main. Até lá, o app roda no endereço de teste da Vercel, sem login e sem pagamento.

## 1. Firebase (banco e login), cerca de 10 minutos

1. Em https://console.firebase.google.com, crie um projeto novo chamado **lume-app**. O Google Analytics pode ficar desligado.
2. **Build › Authentication › Get started**. Não precisa ligar nenhum provedor: o login é por código no e-mail, feito pelo nosso servidor.
3. **Build › Firestore Database › Create database**, modo **production**, região **southamerica-east1 (São Paulo)**.
4. Em **Firestore › Rules**, apague o que estiver lá, cole o conteúdo do arquivo `firestore.rules` deste projeto e clique em **Publish**.
5. **Configurações do projeto › Contas de serviço › Gerar nova chave privada**. Baixa um arquivo `.json`: o conteúdo inteiro vai na variável `FIREBASE_SERVICE_ACCOUNT` (passo 5). Não mande esse arquivo por e-mail nem por chat.
6. **Configurações do projeto › Geral › Seus apps › Web (`</>`)**, apelido "Lume". Copie o bloco `firebaseConfig` e me mande: ele é público e o app usa na Fase 3.

## 2. Lastlink (os três planos)

1. Crie os produtos: **Lume Anual** R$ 97, **Lume Trimestral** R$ 47 e **Lume Mensal** R$ 19,90 (de preferência só no cartão). Se a Lastlink fizer cobrança recorrente trimestral e anual, use recorrência; se não, um pagamento único com 365 e 92 dias de acesso também funciona.
2. Anote o **código de cada produto** (aquele do link `lastlink.com/p/CÓDIGO/...`). Com eles, a variável `LUME_PLANOS` fica assim:
   `{"CODIGO_ANUAL":{"plano":"anual","dias":365},"CODIGO_TRIMESTRAL":{"plano":"trimestral","dias":92},"CODIGO_MENSAL":{"plano":"mensal","dias":31}}`
3. Em **Webhooks**, crie um novo:
   - URL: `https://www.fluxovital.top/api/lastlink-webhook-cjo`
   - Cabeçalho `X-Lastlink-Token` com o valor de `LASTLINK_TOKEN_LUME` (passo 4)
   - Eventos: compra aprovada, pagamento recorrente ou renovação, cancelamento, reembolso e chargeback
4. Faça um envio de teste de cada evento e me mande o corpo de uma **renovação** e de um **cancelamento**. Com isso, confirmo os nomes exatos dos eventos.

## 3. Brevo (e-mail do código de acesso)

1. Em **Remetentes**, cadastre e confirme o e-mail que vai mandar o código (por exemplo, `ola@seudominio.com`).
2. Em **SMTP e API › Chaves de API**, gere uma chave para o Lume.

## 4. Chaves do próprio Lume

No terminal, nesta pasta:

- `node scripts/gerar-vapid.mjs` gera `VAPID_PUBLICA` e `VAPID_PRIVADA`, as chaves dos avisos no celular.
- `node -e "console.log(require('crypto').randomBytes(24).toString('base64url'))"`: rode duas vezes, uma para `LUME_SEGREDO_CODIGO` e outra para `LUME_CRON_TOKEN`, e uma terceira para `LASTLINK_TOKEN_LUME`.

## 5. Variáveis de ambiente na Vercel

Projeto **funil-vendas › Settings › Environment Variables**, em Production e Preview:

| Variável | Valor |
|---|---|
| `FIREBASE_SERVICE_ACCOUNT` | o JSON inteiro do passo 1.5, numa linha só |
| `LASTLINK_TOKEN_LUME` | o token do webhook (passo 4) |
| `LUME_PLANOS` | o JSON dos planos (passo 2.2) |
| `BREVO_API_KEY` | a chave do passo 3.2 |
| `BREVO_REMETENTE_EMAIL` | o e-mail confirmado no passo 3.1 |
| `BREVO_REMETENTE_NOME` | `Equipe Lume` |
| `LUME_SEGREDO_CODIGO` | o segredo do passo 4 |
| `VAPID_PUBLICA` e `VAPID_PRIVADA` | as chaves do passo 4 |
| `VAPID_ASSUNTO` | `mailto:` seguido do seu e-mail de contato |
| `LUME_CRON_TOKEN` | o token do passo 4 |

Se preferir, eu crio essas variáveis direto na Vercel: é só me autorizar. Os valores secretos nunca aparecem na conversa.

## 6. cron-job.org (avisos de minuto em minuto)

Na mesma conta que roda os crons do melasma, crie um job:

- URL: `https://www.fluxovital.top/api/push-tick`
- A cada 1 minuto
- Cabeçalho `Authorization: Bearer <LUME_CRON_TOKEN>`

## 7. Compradoras antigas

Exporte da Lastlink as vendas do CJO de R$ 27 (CSV) e me mande o arquivo. Eu rodo `node scripts/importar-compradoras.mjs vendas.csv` primeiro só para contar e, com o seu ok, de novo com `--gravar`. Cada e-mail ganha acesso vitalício ao Lume.

---

## Para quem for mexer no código

- Testes: `node --test tests/*.test.mjs` (motor, migração, Web Push com o exemplo da RFC 8291, Google, regras de assinatura e fluxos das funções com Firestore simulado).
- O visual vem do design system Lume: `design/lume/` é a fonte. Depois de mudar `tokens.json` ou `componentes.css`, rode `node scripts/gerar-css-lume.mjs`.
- Ao publicar mudanças no app, troque `VERSAO` em `Funil CJO/lume-sw.js` para os celulares baixarem os arquivos novos.
- Dados no Firestore: `entitlements/{email}` (acesso), `eventos/{chave}` (webhooks já processados), `leads/{uid}` (respostas do quiz), `codigos/{uid}` (código de login), `push/{uid}` e `avisos/{uid}_{tag}` (avisos agendados), `usuarios/{uid}` (dados do app, Fase 3).
