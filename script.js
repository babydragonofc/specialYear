// Garante que o script só rode depois que o HTML for completamente carregado
document.addEventListener('DOMContentLoaded', () => {

    // --- Lógica da Animação de Onda para o "Magic Secret" ---
    const magicSecretEl = document.getElementById('magicSecret');
    if (magicSecretEl) { // Verifica se o elemento existe
        const magicSecretText = magicSecretEl.textContent;
        magicSecretEl.innerHTML = ''; // Limpa o texto original

        magicSecretText.split('').forEach((char, index) => {
            const span = document.createElement('span');
            span.textContent = char === ' ' ? '\u00A0' : char; // Substitui espaço por non-breaking space para manter o espaçamento
            span.style.animationDelay = `${index * 0.1}s`; // Adiciona um atraso para criar o efeito de onda
            magicSecretEl.appendChild(span);
        });
    }

    // Função para ajustar a altura da viewport (problema de 100vh em mobile)
    const setVh = () => {
        const vh = window.innerHeight * 0.01;
        document.documentElement.style.setProperty('--vh', `${vh}px`);
    };

    // Roda a função no carregamento e no redimensionamento da janela
    window.addEventListener('resize', setVh);
    setVh(); // Roda na primeira vez para definir o valor inicial

    // --- Lógica de Pré-carregamento de Imagens ---
    function preloadImages(urls) {
        const promises = urls.map(url => {
            return new Promise((resolve, reject) => {
                if (!url) { // Pula URLs vazias ou nulas
                    resolve();
                    return;
                }
                const img = new Image();
                img.src = url;
                img.onload = resolve;
                img.onerror = reject; // Em caso de erro, podemos decidir o que fazer
            });
        });
        return Promise.all(promises);
    }

    // Lógica para o botão de entrada
    const body = document.querySelector('body');
    const enterButton = document.getElementById('enter-btn');
    const welcomeScreen = document.querySelector('.welcome-screen');
    const mainContent = document.querySelector('.main-content');

    const galleryButton = document.getElementById('gallery-btn');
    const messagesButton = document.getElementById('messages-btn');
    const extrasButton = document.getElementById('extras-btn');

    const totalSecrets = document.getElementById('totalSecrets');
    const secretsNumber = document.getElementById('secretsNumber');


    // Adiciona um listener para o clique no botão
    enterButton.addEventListener('click', () => {
        // Adiciona a classe 'hidden' ao container de boas-vindas para iniciar a animação
        welcomeScreen.classList.add('hidden');
        // Adiciona a classe 'visible' ao conteúdo principal para que ele também suba
        mainContent.classList.add('visible');
        body.classList.add('move')
        setTimeout(() => {
            galleryButton.classList.add('visible');
            messagesButton.classList.add('visible');
            extrasButton.classList.add('visible');
        }, 1200); // Aumentado para corresponder à nova duração da transição
    });

    // Lógica para o botão da galeria
    const gallery = document.getElementById('galeria');
    const overlay = document.getElementById('overlay');
    const messagesSection = document.getElementById('mensagens');
    const extrasSection = document.getElementById('extras');
    const messagesMain = document.querySelector('#mensagens main');

    // Função genérica para fechar seções ao clicar no fundo
    const closeSectionOnClickOutside = (event) => {
        // Se o clique foi no próprio elemento de seção (o overlay) e não em um filho como o 'main'
        if (event.target === event.currentTarget) {
            event.currentTarget.classList.remove('visible');
        }
    };

    // Abrir galeria
    galleryButton.addEventListener('click', () => {
        gallery.classList.add('visible');
    });

    // Abrir aba de Mensagens
    messagesButton.addEventListener('click', () => {
        messagesSection.classList.add('visible');
    });

    // Abrir aba de Extras
    extrasButton.addEventListener('click', () => {
        extrasSection.classList.add('visible');
    });

    // Adiciona os listeners para fechar as seções
    gallery.addEventListener('click', closeSectionOnClickOutside);
    messagesSection.addEventListener('click', closeSectionOnClickOutside);
    extrasSection.addEventListener('click', closeSectionOnClickOutside);

    // --- Lógica da Galeria de Fotos (Refatorada para Scroll) ---

    let photos = [];

    function savePhotos() {
        localStorage.setItem('PhotosSave', JSON.stringify(photos));
    }

    function loadPhotos() {
        const saved = localStorage.getItem('PhotosSave');
        if (saved) {
            photos = JSON.parse(saved);
        } else {
            photos = [
                {name: "pezinho <3",                        img: "photos/photo(1).jpeg",  img2: "photos/photo(4).jpeg" ,rotate: 10,  writed: false},
                {name: "NÃO ME FAÇA DE PALHAÇA...",         img: "photos/photo(2).jpeg",  img2: "photos/photo(1).jpeg" ,rotate: -5,  writed: false},
                {name: "O nerd e a rainha",                 img: "photos/photo(3).jpeg",  img2: "photos/photo(2).jpeg" ,rotate: 15,  writed: false},
                {name: "Tava no meu bolso :(",              img: "photos/photo(4).jpeg",  img2: "photos/photo(4).jpeg" ,rotate: -10, writed: false},
                {name: "*Cabecinhas*",                      img: "photos/photo(5).jpeg",  img2: "photos/photo(5).jpeg" ,rotate: 8,   writed: false},
                {name: 'Sorrisos são pra sempre com você',  img: "photos/photo(6).jpeg",  img2: "photos/photo(7).jpeg" ,rotate: 0,   writed: false},
                {name: "Você aceita?",                      img: "photos/photo(7).jpeg",  img2: "photos/photo(8).jpeg" ,rotate: -12, writed: false},
                {name: "Lembra? No fim, valeu a pena :D",   img: "photos/photo(8).jpeg",  img2: "photos/photo(8).jpeg" ,rotate: 20,  writed: false},
                {name: "Meu coração é todo seu <3",         img: "photos/photo(9).jpeg",  img2: "photos/photo(9).jpeg" ,rotate: -3,  writed: false},
                {name: '"A" + "legal',                      img: "photos/photo(10).jpeg", img2: "photos/photo(10).jpeg",rotate: 12,  writed: false},
                {name: "Minha princessa sorrindo",          img: "photos/photo(11).jpeg", img2: "photos/photo(11).jpeg",rotate: -8,  writed: false},
                {name: "Acho que falta algo...",            img: "photos/paperEnerg.png", img2: "photos/paperEnerg.png",rotate: 5,   writed: false}
            ];
        }
    }

    function addPhoto(name, img, img2, rotate) {
        photos.push({name: name, img: img, img2: img2, rotate: rotate, writed: false});

        const notification = document.getElementById('photo-notification');
        const notificationText = document.getElementById('photo-notification-text');

        notificationText.textContent = "Novas memórias foram resgatadas";

        notification.classList.add('show');

        setTimeout(() => {
            notification.classList.remove('show');
        }, 3000);
    }

    loadPhotos();

    let secrets = [];

    function saveSecrets() {
        localStorage.setItem('secretsSave', JSON.stringify(secrets));
    }

    function loadSecrets() {
        const saved = localStorage.getItem('secretsSave');
        if (saved) {
            secrets = JSON.parse(saved);
            secrets.forEach(el => {
                if (el.find && el.obj != false) {
                    document.getElementById(el.obj).style.display = "none";
                }
            });
        } else {
            secrets = [
                {name: '"Aceito"', desc: "Uma eterna e sagrada união <br> da alma e do corpo em um só.", find: false, obj: false},
                {name: "Caneta", desc: "Escrever nossa história <br> para ninguém apagar <br> (vá à galeria)", find: false, obj: "penG"}
            ];
        }
    }

    loadSecrets();

    var cards = [
        {title: "1 ANO", text: "1, 2, 4, 8, 10, 12... passou rápido? Nah <br> Honestamente, cada momento com você foi especial a um nível que eu não me imagino sem você, afinal, são 12 messes kkk. <br> Eu espero que esse tenha sido só o começo de tudo, um bom começo, mas não um começo fácil, mas eu estou muito feliz em poder superar tudo isso com você, com a pessoa a qual eu quero dedicar a minha vida e meu cuidado, a pessoa que eu quero do meu lado, nos momentos bons e nos ruins, na saúde e na doença<br> espero construir uma família solida com você, ter um casamento saudável e uma casinha, te dar as coisas que você não teve<br><br>Esse é só o começo :)", img: "cards/10636332.jpg", front:"cards/10636332.jpg", rotate: 3, bg: true, imgFill: false, width: "auto"},
        {title: "", text: "", img: "cards/claricePaper.png", front:"cards/capaClaricePaper.png", rotate: -5, bg: true, imgFill: true, width: "428px"},
        {title: "", text: "", img:"cards/cerejeira.png", front:"cards/cerejeira.png", rotate: 3, bg: false, imgFill: true, width: "auto"}
    ];

    const musics = [
        {name: "Tudo que eu sempre sonhei", artista: "pullover", file: "musics/Tudo_que_eu_sempre_sonhei.mp3", photo: "https://cdn-images.dzcdn.net/images/cover/33d70251f40848052b216707eff6830f/0x1900-000000-80-0-0.jpg"},
        {name: "Uma arlinda mulher", artista: "Mamonas assasinas", file:"musics/Uma Arlinda Mulher - Mamonas Assassinas - SoundLoadMate.com.mp3", photo: "https://upload.wikimedia.org/wikipedia/pt/5/54/Musicasmamonasassassinas.jpg"}
    ];

    totalSecrets.innerHTML = secrets.length;
    secretsNumber.innerHTML = secrets.filter(secret => secret.find).length;

    const allImageUrls = [
        ...photos.map(p => p.img),
        ...photos.map(p => p.img2),
        ...cards.map(c => c.img),
        ...cards.map(c => c.front)
    ];

    preloadImages(allImageUrls)
        .then(() => {
            console.log('Todas as imagens foram pré-carregadas com sucesso!');
            enterButton.disabled = false;
            enterButton.textContent = 'Entrar';
        })
        .catch(errorEvent => {
            console.error('Falha ao pré-carregar uma ou mais imagens:', errorEvent);
            enterButton.disabled = false;
            enterButton.textContent = 'Entrar';
        });

    const photosContainer = document.querySelector('.photos-container');
    const writeBtn = document.getElementById('write-btn');
    const eraseBtn = document.getElementById('erase-btn');

         //a
    let photoSelected = 0;
    // Adiciona uma flag para prevenir cliques durante a animação e define a duração.
    let isAnimating = false;
    const animationDuration = 500; // Deve ser igual à duração da transição no CSS (0.5s)

    // Seleciona os elementos da galeria
    const photoEl0 = document.getElementById('photo-0');
    const photoEl1 = document.getElementById('photo-1');
    const photoEl2 = document.getElementById('photo-2');
    const photoEl0Overlay = document.getElementById('photo-0-overlay');
    const photoEl1Overlay = document.getElementById('photo-1-overlay');
    const photoEl2Overlay = document.getElementById('photo-2-overlay');

    const photoNameDisplay = document.getElementById('photoNameDisplay');
    
    // Array para gerenciar os elementos DOM e suas posições.
    // A ordem no array representa a posição visual: [esquerda, centro, direita]
    let photoElements = [
        { el: photoEl0, overlay: photoEl0Overlay }, // Começa na esquerda
        { el: photoEl1, overlay: photoEl1Overlay }, // Começa no centro
        { el: photoEl2, overlay: photoEl2Overlay }, // Começa na direita
    ];

    // Configuração inicial do z-index para garantir a ordem de empilhamento correta.
    photoElements[0].el.style.zIndex = 1; // Esquerda
    photoElements[1].el.style.zIndex = 2; // Centro (na frente)
    photoElements[2].el.style.zIndex = 1; // Direita

     // Função auxiliar para animar a troca de nome
    function updatePhotoNameWithFade() {
        // 1. Torna o texto transparente (inicia o fade-out)
        photoNameDisplay.style.opacity = 0;
        // 2. Após o fade-out, troca o texto e o torna opaco novamente (inicia o fade-in)
        setTimeout(() => {
            photoNameDisplay.textContent = photos[photoSelected].name;
            photoNameDisplay.style.opacity = 1;
        }, 200); // Este tempo deve ser igual ou um pouco maior que a transição do CSS
    }

    // --- Navegação da Galeria ---

    // Função para navegar para a próxima foto (DIREITA)
    function navigateNext() {
        if (isAnimating) return; // Impede novos cliques durante a animação
        isAnimating = true;

        // Agenda a animação do nome para ocorrer no meio da transição das fotos
        setTimeout(updatePhotoNameWithFade, (animationDuration / 2) - 100);

        // O elemento da direita (que vai para o centro) recebe um z-index maior para animar por cima.
        photoElements[2].el.style.zIndex = 3;

        // Identifica o elemento que será reciclado (o da esquerda) antes de rotacionar o array.
        const recycledElement = photoElements[0];

        // Rotaciona o array de elementos e atualiza o índice da foto
        photoElements.push(photoElements.shift());
        photoSelected = (photoSelected + 1) % photos.length;
        
        // Renderiza as novas posições, mas pula a atualização da imagem do elemento reciclado.
        renderPhotos(recycledElement);

        // Após um breve atraso (quando o cartão está "atrás"), atualiza sua imagem.
        setTimeout(() => {
            const nextIndex = (photoSelected + 1) % photos.length;
            recycledElement.overlay.style.backgroundImage = `url('${photos[nextIndex].img}')`;
        }, animationDuration / 2.5); // Um pouco menos da metade da animação.

        // Após a animação, restaura o z-index de todos os elementos para o estado correto.
        setTimeout(() => {
            isAnimating = false;
            photoElements[0].el.style.zIndex = 1; // Esquerda
            photoElements[1].el.style.zIndex = 2; // Centro
            photoElements[2].el.style.zIndex = 1; // Direita
            manageParticleEffect();
        }, animationDuration);
    }

    // Função para navegar para a foto anterior (ESQUERDA)
    function navigatePrev() {
        if (isAnimating) return;
        isAnimating = true;

        // Agenda a animação do nome para ocorrer no meio da transição das fotos
        setTimeout(updatePhotoNameWithFade, (animationDuration / 2) - 100);

        // O elemento da esquerda (que vai para o centro) recebe um z-index maior para animar por cima.
        photoElements[0].el.style.zIndex = 3;

        // Identifica o elemento que será reciclado (o da direita).
        const recycledElement = photoElements[2];

        photoElements.unshift(photoElements.pop());
        photoSelected = (photoSelected - 1 + photos.length) % photos.length;
        
        // Renderiza as novas posições, pulando a atualização da imagem do elemento reciclado.
        renderPhotos(recycledElement);

        // Após um breve atraso, atualiza a imagem do cartão reciclado.
        setTimeout(() => {
            const prevIndex = (photoSelected - 1 + photos.length) % photos.length;
            recycledElement.overlay.style.backgroundImage = `url('${photos[prevIndex].img}')`;
        }, animationDuration / 2.5);

        // Após a animação, restaura o z-index de todos os elementos para o estado correto.
        setTimeout(() => {
            isAnimating = false;
            photoElements[0].el.style.zIndex = 1; // Esquerda
            photoElements[1].el.style.zIndex = 2; // Centro
            photoElements[2].el.style.zIndex = 1; // Direita
            manageParticleEffect();
        }, animationDuration);
    }

    // Usa delegação de eventos no container para lidar com os cliques
    photosContainer.addEventListener('click', (event) => {
        const clickedPhoto = event.target.closest('.photo');
        // Previne cliques durante a animação ou fora de uma foto
        if (!clickedPhoto || isAnimating) return;

        // Verifica qual elemento foi clicado (direita, esquerda ou centro)
        if (clickedPhoto === photoElements[2].el) { // Elemento da direita
            navigateNext();
        } else if (clickedPhoto === photoElements[0].el) { // Elemento da esquerda
            navigatePrev();
        } else if (clickedPhoto === photoElements[1].el) { // Elemento do centro
            // Ação para o clique na foto do meio.
            if (photoSelected == 5) {
                findSecret(0)
            }

            if (photoSelected == 11 && photos[photoSelected].writed && !energy) {
                energyFill()
            }

        }
    });

    function renderPhotos(skipUpdateForElement = null) {
        // Índices das fotos a serem exibidas
        const prevIndex = (photoSelected - 1 + photos.length) % photos.length;
        const nextIndex = (photoSelected + 1) % photos.length;

        // Pega os elementos DOM nas posições atuais
        const left = photoElements[0];
        const center = photoElements[1];
        const right = photoElements[2];

        if (photoSelected == 5) {
            center.el.classList.add('star');
        } else {
            center.el.classList.remove('star');
        }

        // Atualiza a foto da ESQUERDA
        if (left !== skipUpdateForElement) {
            left.overlay.style.backgroundImage = `url('${photos[prevIndex].writed? photos[prevIndex].img2 :photos[prevIndex].img}')`;
        }
        left.el.style.transform = `translateX(-120px) scale(0.75) rotate(${photos[prevIndex].rotate}deg)`;

        // Atualiza a foto do CENTRO
        if (center !== skipUpdateForElement) {
            center.overlay.style.backgroundImage = `url('${photos[photoSelected].writed? photos[photoSelected].img2 :photos[photoSelected].img}')`;
        }
        center.el.style.transform = `translateX(0) scale(1) rotate(${photos[photoSelected].rotate}deg)`;

        // Atualiza a foto da DIREITA
        if (right !== skipUpdateForElement) {
            right.overlay.style.backgroundImage = `url('${photos[nextIndex].writed? photos[nextIndex].img2 :photos[nextIndex].img}')`;
        }
        right.el.style.transform = `translateX(120px) scale(0.75) rotate(${photos[nextIndex].rotate}deg)`;

        if (secrets[1].find) {
            if (photos[photoSelected].writed) {
                writeBtn.style.display = "none"
                eraseBtn.style.display = "block"
            }
            else {
                writeBtn.style.display = "block"
                eraseBtn.style.display = "none"
            }
        }
        savePhotos();
    }


    let particleInterval = null;
    
    function createStarParticle(container) {
        const particle = document.createElement('div');
        particle.classList.add('particle');
        const size = Math.random() * 8 + 5;
        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;
        particle.style.top = `${Math.random() * 100}%`;
        particle.style.left = `${Math.random() * 100}%`;
        container.appendChild(particle);
        setTimeout(() => particle.remove(), 1500);
    }

    function startStarEffect(element) {
        if (particleInterval) return;
        particleInterval = setInterval(() => createStarParticle(element), 150);
    }

    function stopStarEffect() {
        clearInterval(particleInterval);
        particleInterval = null;
    }

    function manageParticleEffect() {
        const centerElement = photosContainer.querySelector(`.photo[data-index="${photoSelected}"]`);
        if (!centerElement) {
            stopStarEffect();
            return;
        };
        const isStar = centerElement.classList.contains('star');
        if (isStar && !particleInterval) {
            startStarEffect(centerElement);
        } else if (!isStar && particleInterval) {
            stopStarEffect();
        }
    }

    writeBtn.addEventListener('click', () => {
        photos[photoSelected].writed = true;
        const photoDiv = photosContainer.querySelector(`.photo[data-index="${photoSelected}"] > div`);
        if (photoDiv) {
            photoDiv.style.backgroundImage = `url('${photos[photoSelected].img2}')`;
        }
        renderPhotos();
    });

    eraseBtn.addEventListener('click', () => {
        photos[photoSelected].writed = false;
        const photoDiv = photosContainer.querySelector(`.photo[data-index="${photoSelected}"] > div`);
        if (photoDiv) {
            photoDiv.style.backgroundImage = `url('${photos[photoSelected].img}')`;
        }
        renderPhotos();
        
    });
    
    function findSecret(secretId) {
        const secretMsgName = document.getElementById('secretMsgName');
        const secretMsgText = document.getElementById('secretMsgText');
        secretMsgText.innerHTML = '';
        secretMsgName.innerHTML = secrets[secretId].name;
        overlay.classList.add('visible');
        
        const descText = secrets[secretId].desc;
        const typingSpeed = 40;
        const animationStartDelay = 700;
        const magicSecret = document.getElementById('magicSecret');
        
        const lines = descText.split(/<br\s*\/?>/i);
        lines.forEach((line, lineIndex) => {
            line.split('').forEach(char => {
                const span = document.createElement('span');
                span.textContent = char;
                secretMsgText.appendChild(span);
            });
            if (lineIndex < lines.length - 1) {
                secretMsgText.appendChild(document.createElement('br'));
            }
        });
        
        if (!secrets[secretId].find) {
            magicSecret.classList.add('visible');
            secrets[secretId].find = true;
            saveSecrets();
        } else {
            magicSecret.classList.remove('visible');
        }

        secretsNumber.innerHTML = secrets.filter(secret => secret.find).length;
        
        secretMsgText.querySelectorAll('span').forEach((span, index) => {
            setTimeout(() => {
                span.classList.add('visible');
            }, animationStartDelay + (index * typingSpeed));
        });
    }

    overlay.addEventListener('click', (event) => {
        if (event.target === overlay && !overlay.classList.contains('hiding')) {
            overlay.classList.add('hiding');
            setTimeout(() => {
                overlay.classList.remove('visible', 'hiding');
            }, 400);
        }
    });

    const cardsContainer = document.getElementById('cards-container');
    const letterView = document.getElementById('letter-view');
    const letterContent = document.getElementById('letter-content');
    const letterTitle = document.getElementById('letter-title');
    const letterText = document.getElementById('letter-text');
    const closeLetterBtn = document.querySelector('.close-letter-btn');
    const letterZoomText = document.getElementById('letter-zoom-text');

    let isPanning = false;
    let startX = 0, startY = 0;
    let currentTranslateX = 0, currentTranslateY = 0;

    letterContent.addEventListener('click', (event) => {
        const dragDistance = Math.sqrt(Math.pow(event.clientX - startX, 2) + Math.pow(event.clientY - startY, 2));
        if (dragDistance > 5) return;

        if (letterContent.classList.contains('zoomable') && !event.target.closest('.close-letter-btn')) {
            if (letterContent.classList.contains('zoomed')) {
                letterContent.style.transformOrigin = 'center center';
                currentTranslateX = 0;
                currentTranslateY = 0;
                letterContent.style.transform = '';
                letterContent.classList.remove('zoomed');
            } else {
                const rect = letterContent.getBoundingClientRect();
                const x = event.clientX - rect.left;
                const y = event.clientY - rect.top;
                letterContent.style.transformOrigin = `${x}px ${y}px`;
                currentTranslateX = 0;
                currentTranslateY = 0;
                letterContent.classList.add('zoomed');
            }
        }
    });

    letterContent.addEventListener('mousedown', (event) => {
        startX = event.clientX;
        startY = event.clientY;
        if (letterContent.classList.contains('zoomed')) {
            event.preventDefault();
            isPanning = true;
            letterContent.classList.add('panning');
        }
    });

    window.addEventListener('mousemove', (event) => {
        if (!isPanning) return;
        const dx = event.clientX - startX;
        const dy = event.clientY - startY;
        const newTranslateX = currentTranslateX + dx;
        const newTranslateY = currentTranslateY + dy;
        const rotate = letterContent.style.getPropertyValue('--initial-rotate');
        letterContent.style.transform = `translateX(${newTranslateX}px) translateY(${newTranslateY}px) scale(1.8) rotate(${rotate})`;
    });

    window.addEventListener('mouseup', (event) => {
        if (!isPanning) return;
        isPanning = false;
        letterContent.classList.remove('panning');
        currentTranslateX += event.clientX - startX;
        currentTranslateY += event.clientY - startY;
    });

    
    function addCard(cardId) {
        const cardElement = document.createElement("button")
        cardElement.classList.add("paper");
        cardElement.style.backgroundImage = `url('${cards[cardId].front}')`;
        cardElement.style.transform = `rotate(${cards[cardId].rotate}deg)`;
        cardElement.addEventListener("click", function() {
            openCard(cardId);
        });
        cardsContainer.appendChild(cardElement);
        cardElement.style.boxShadow = cards[cardId].bg? "5px 7px 12px 6px rgba(0, 0, 0, 0.41)": "none"

        // Rola suavemente para o final para mostrar a nova carta
        // Isso funciona por causa do `scroll-behavior: smooth;` no CSS
    }

    function openCard(cardId) {
        const cardData = cards[cardId];

        // Popula o conteúdo da carta
        letterTitle.textContent = cardData.title;
        letterText.innerHTML = cardData.text;
        letterContent.style.backgroundImage = `url('${cardData.img}')`;
        // Usa uma variável CSS para a rotação, permitindo que o CSS controle o zoom
        letterContent.style.setProperty('--initial-rotate', `${-cardData.rotate}deg`);
        
        // Mostra a visualização da carta com a animação
        letterView.classList.add('visible');

        // Garante que a carta comece do topo
        letterContent.scrollTop = 0;

        letterContent.style.boxShadow = cardData.bg? "0 10px 30px rgba(0, 0, 0, 0.3)": "none";
        letterContent.style.backgroundRepeat = cardData.bg? "repeat": "no-repeat";
        console.log(letterContent.style.backgroundRepeat)

        if (cardData.width != "auto") {
            console.log(cardData.width)
            letterContent.style.width = cardData.width;
        }
        else {
            console.log('b')
            letterContent.style.width = "100%"
        }
        // Usa um timeout para garantir que o navegador calculou as alturas
        setTimeout(() => {
            checkLetterScrollability();
        }, 100); // Um pequeno atraso para segurança
    }

    // Função para verificar se a carta é rolável e mostrar/esconder o indicador
    function checkLetterScrollability() {
        const isScrollable = letterContent.scrollHeight > letterContent.clientHeight;

        if (isScrollable) {
            letterContent.classList.add('is-scrollable');
            letterContent.classList.remove('zoomable'); // Garante que não seja 'zoomable'
            // Se já estiver no fundo (conteúdo pouco maior que a tela), esconde o indicador
            const isAtBottom = letterContent.scrollTop + letterContent.clientHeight >= letterContent.scrollHeight;
            if (isAtBottom) {
                letterContent.classList.add('scrolled-to-bottom');
            } else {
                letterContent.classList.remove('scrolled-to-bottom');
            }
        } else {
            letterContent.classList.remove('is-scrollable');
            // Adiciona a classe que permite o zoom
            letterContent.classList.add('zoomable');
        }
    }

    // Adiciona listeners para fechar a carta
    closeLetterBtn.addEventListener('click', () => {
        letterView.classList.remove('visible')
        // Limpa todas as classes de estado ao fechar
        letterContent.classList.remove('is-scrollable', 'scrolled-to-bottom', 'zoomable', 'zoomed');
        letterContent.style.transformOrigin = ''; // Reseta a origem da transformação
        letterContent.style.transform = ''; // Reseta a transformação do arraste
        currentTranslateX = 0;
        currentTranslateY = 0;
    });
    letterView.addEventListener('click', (event) => {
        if (event.target === letterView) {
            letterView.classList.remove('visible');
            // Limpa todas as classes de estado ao fechar
            letterContent.classList.remove('is-scrollable', 'scrolled-to-bottom', 'zoomable', 'zoomed');
            letterContent.style.transformOrigin = ''; // Reseta a origem da transformação
            letterContent.style.transform = ''; // Reseta a transformação do arraste
            currentTranslateX = 0;
            currentTranslateY = 0;
        }
    });

  
    // Listener para o evento de rolagem na carta
    letterContent.addEventListener('scroll', () => {
        // Verifica se o usuário rolou até o final (com uma pequena tolerância)
        const isAtBottom = letterContent.scrollTop + letterContent.clientHeight >= letterContent.scrollHeight - 5;
        if (isAtBottom) {
            letterContent.classList.add('scrolled-to-bottom');
        } else {
            letterContent.classList.remove('scrolled-to-bottom');
        }
    });

    addCard(0);
    addCard(1);
    addCard(2)







    function closeLetterView() {
        letterView.classList.remove('visible');
        letterContent.classList.remove('is-scrollable', 'scrolled-to-bottom', 'zoomable', 'zoomed');
        letterContent.style.transformOrigin = '';
        letterContent.style.transform = '';
        currentTranslateX = 0;
        currentTranslateY = 0;
    }

    closeLetterBtn.addEventListener('click', closeLetterView);
    letterView.addEventListener('click', (event) => {
        if (event.target === letterView) closeLetterView();
    });

    letterContent.addEventListener('scroll', () => {
        const isAtBottom = letterContent.scrollTop + letterContent.clientHeight >= letterContent.scrollHeight - 5;
        letterContent.classList.toggle('scrolled-to-bottom', isAtBottom);
    });
    
    const audioPlayer = document.getElementById('audio');
    const pauseBtn = document.getElementById("pause-btn");
    const musicThumbFill = document.getElementById("music-thumb-fill");
    const musicsD = document.getElementById('musics');

    let musicSelectedN = null;
    let musicSelected = null;

    musics.forEach((musicData, id) => addMusic(id));

    function addMusic(id) {
        const music = document.createElement("button");
        music.classList.add("music");
        music.innerHTML = `
            <img src="${musics[id].photo}" alt="Capa da música">
            <div class="music-info">
                <h3 class="music-title"><span>${musics[id].name}</span></h3>
                <p class="music-artist">${musics[id].artista}</p>
            </div>`;
        musicsD.appendChild(music);

        const musicTitle = music.querySelector('.music-title');
        const musicTitleSpan = music.querySelector('.music-title span');
        if (musicTitleSpan.clientWidth > musicTitle.clientWidth) {
            musicTitle.classList.add('scrolling');
        }

        music.addEventListener("click", () => selectMusic(id));
    }

    function selectMusic(musicId) {
        musicSelectedN = musicId;
        musicSelected = musics[musicId];
        audioPlayer.src = musicSelected.file;
        playMusic();
    }

    function playMusic() {
        audioPlayer.play();
        pauseBtn.children[0].src = "unpause.svg";
    }

    function pauseMusic() {
        if (audioPlayer.paused) {
            playMusic();
        } else {
            audioPlayer.pause();
            pauseBtn.children[0].src = "pause.svg";
        }
    }
    
    pauseBtn.addEventListener("click", pauseMusic);

    audioPlayer.addEventListener("timeupdate", () => {
        const progress = (audioPlayer.currentTime / audioPlayer.duration) * 100;
        musicThumbFill.style.width = `${progress}%`;
    });

    audioPlayer.addEventListener("ended", () => {
        pauseBtn.children[0].src = "pause.svg";
    });

    const penG = document.getElementById("penG");
    penG.addEventListener("click", () => {
        findSecret(1);
        penG.style.display = "none";
    });
    
    var energy = false;
    function energyFill() {
        const energyOverlay = document.getElementById('energyOverlay');
        const energyText = energyOverlay.querySelector('.energyText');
        const text = energyText.textContent;

        document.getElementById('energyOverlay').classList.add("active");
        energy = true;

        // Limpa o texto e o reescreve letra por letra
        energyText.innerHTML = '';
        let i = 0;

        function typeWriter() {
            if (i < text.length) {
                energyText.innerHTML += text.charAt(i);
                i++;
                setTimeout(typeWriter, 100); // Velocidade de digitação
            }
            else {
                document.getElementsByClassName("energyBtn")[0].classList.add('active')
            }
        }
        
        // Atraso para começar a escrever depois da animação do overlay
        setTimeout(typeWriter, 1000); // 1s, igual à duração da animação energyFill

        document.getElementById("shadow").classList.add('active');
        document.getElementsByClassName('lI')[0].src = "luz2.png";
        document.getElementsByClassName('lI')[1].src = "luz2.png";

        //logica de abertura de div

        document.getElementsByClassName('c-btn')[0].classList.add('active')
        document.getElementById('sdwTxt').style.display = "none"
        document.getElementsByClassName("shadow-content")[0].style.display = "flex"

        document.getElementById('msg').style.pointerEvents = "auto"
        document.getElementById('gal').style.pointerEvents = "auto"
        document.getElementById('msg').style.opacity = '1'
        document.getElementById('gal').style.opacity = '1'
    }

    document.getElementsByClassName('energyBtn')[0].addEventListener("click", function() {
        document.getElementById("energyOverlay").style.opacity = "0"
        setTimeout(function() {
            document.getElementById("energyOverlay").style.display = "none"
        }, 6000)
    })

    document.getElementById('msg').addEventListener('click', function(){ miniPaperOpen(0)})
    document.getElementById('gal').addEventListener('click', function(){ miniPaperOpen(1)})

    
    const miniPapers = [
        'msg',
        'gal',
        'ext'
    ]

    var miniPaperColect = 0

    document.getElementsByClassName('c-btn')[0].addEventListener('click', futurePapers)

    function futurePapers() {
        //verificar se tem a classe 'active'
        if (document.getElementsByClassName('c-btn')[0].classList.contains('active')) {
            miniPaperOpen(2)
            document.getElementsByClassName('c-btn')[0].classList.remove('active')
            return;
        }
    }

    function miniPaperOpen(id) {
        if (miniPaperColect > 3) return;

        miniPaperColect += 1;

        if (id != 2) {
            const el = document.getElementById(miniPapers[id]).style
            el.opacity = "0"
            el.pointerEvents = "none"
        }

        document.getElementById("miniPaperLight").classList.add('active')
        setTimeout(() => {
            document.getElementById("miniPaperLight").classList.remove('active')
        }, 2010);

        if (miniPaperColect == 3) {
            openTheater()
        }
    }

    function openTheater() {
        
    }

    document.getElementById('En').addEventListener('click', function() {
        const senha = document.getElementById('password').value
        if (senha == '123') {
            
            const start = document.getElementById("start")
            start.style.opacity = "0"
            start.style.pointerEvents = "none"
        }
    })
    renderPhotos()
    updatePhotoNameWithFade()

    setTimeout(() => {
        addPhoto("Teste", "photos/photo(1).jpeg", "photos/photo(1).jpeg", 0);
    }, 2000);
});

