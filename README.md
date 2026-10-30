# Feliz aniversário, Júnior Ferreira! 🎉

Homenagem interativa pelos 37 anos do Júnior, com oito fotografias, linha do tempo, carrossel com tela cheia, bilhetes interativos, recados para WhatsApp, confetes e bolo animado.

## Como publicar no GitHub Pages

1. Entre em https://github.com/new e crie um repositório público, por exemplo `aniversario-junior`.
2. Extraia este ZIP. Envie **os arquivos e a pasta `assets`** para a **raiz** do repositório. O arquivo `index.html` precisa estar na raiz, e não dentro de outra pasta.
3. No repositório, entre em **Settings → Pages**.
4. Em **Build and deployment**, escolha **Deploy from a branch** e configure **Branch: `main`** e pasta **`/(root)`**; clique em **Save**.
5. Depois da publicação, abra `https://SEU-USUARIO.github.io/aniversario-junior/`. Substitua `SEU-USUARIO` pelo usuário da sua conta e `aniversario-junior` pelo nome exato do repositório.

A publicação pode demorar alguns minutos para ficar acessível após a configuração.

## Para testar no computador

Abra `index.html` no navegador. As fotos, os estilos e as interações são arquivos locais. **Não é necessário instalar Node.js, bibliotecas ou fazer um build.** Se preferir testar com servidor local, execute `python -m http.server 8000` nesta pasta e acesse http://localhost:8000.

## Conteúdo e ajustes

- **Textos e estrutura:** `index.html`.
- **Visual, cores, responsividade e animações:** `style.css`.
- **Fotos, carrossel, bilhetes, confetes e compartilhamento:** `script.js`.
- **Imagens:** `assets/foto-1.webp` a `assets/foto-8.webp` (cópias otimizadas das fotografias enviadas).
- **Imagem de compartilhamento:** `assets/compartilhar.jpg`. Para garantir uma miniatura no WhatsApp/Facebook, depois de publicar altere `og:image` no `index.html` para o endereço **absoluto** da imagem, por exemplo `https://SEU-USUARIO.github.io/aniversario-junior/assets/compartilhar.jpg`.

### Sobre os recados

Como o GitHub Pages hospeda sites estáticos, não existe banco de dados de mensagens. O texto digitado **não é salvo em um mural público**: os botões permitem copiar o texto ou abrir o WhatsApp com a mensagem pronta, e o visitante escolhe o destinatário.

### Notas

- Layout adaptado para celular e computador.
- Acessível por teclado (setas no álbum, Escape na ampliação, navegação com Tab).
- Respeita a preferência do sistema por redução de movimento.
- Apenas as fontes do Google Fonts são externas; se não houver internet, serão usadas fontes alternativas do sistema.
- Não há música automática, anúncios, analytics, formulários com envio de dados nem dependências JavaScript.
- Compartilhe o endereço somente com o público desejado: repositórios públicos e páginas do GitHub Pages podem ser encontrados e compartilhados por terceiros.

Feito com carinho. ♥
"# niver_jr" 
