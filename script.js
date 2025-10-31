// Garante que o script só rode depois que o HTML for completamente carregado
document.addEventListener('DOMContentLoaded', () => {

    // --- Lógica da Animação de Onda para o "Magic Secret" ---
    const magicSecretEl = getEl('magicSecret');
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
    const enterButton = getEl('enter-btn');
    const welcomeScreen = document.querySelector('.welcome-screen');
    const mainContent = document.querySelector('.main-content');

    const galleryButton = getEl('gallery-btn');
    const messagesButton = getEl('messages-btn');
    const extrasButton = getEl('extras-btn');

    const totalSecrets = getEl('totalSecrets');
    const secretsNumber = getEl('secretsNumber');


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
    const gallery = getEl('galeria');
    const overlay = getEl('overlay');
    const messagesSection = getEl('mensagens');
    const extrasSection = getEl('extras');
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
                {name: "pezinho <3",                        img: "photos/photo(1).jpeg",  img2: "photos/photo(1)p.jpeg" ,rotate: 10,  writed: false},
                {name: "NÃO ME FAÇA DE PALHAÇA...",         img: "photos/photo(2).jpeg",  img2: "photos/photo(2)p.jpg" ,rotate: -5,  writed: false},
                {name: "O nerd e a rainha",                 img: "photos/photo(3).jpeg",  img2: "photos/photo(3)p.jpg" ,rotate: 15,  writed: false},
                {name: "Tava no meu bolso :(",              img: "photos/photo(4).jpeg",  img2: "photos/photo(4)p.jpg" ,rotate: -10, writed: false},
                {name: "*Cabecinhas*",                      img: "photos/photo(5).jpeg",  img2: "photos/photo(5)p.jpg" ,rotate: 8,   writed: false},
                {name: 'Sorrisos são pra sempre com você',  img: "photos/photo(6).jpeg",  img2: "photos/photo(6)p.jpg" ,rotate: 0,   writed: false},
                {name: "Você aceita?",                      img: "photos/photo(7).jpeg",  img2: "photos/photo(7)p.jpg" ,rotate: -12, writed: false},
                {name: "Lembra? No fim, valeu a pena :D",   img: "photos/photo(8).jpeg",  img2: "photos/photo(8)p.jpg" ,rotate: 20,  writed: false},
                {name: "Meu coração é todo seu <3",         img: "photos/photo(9).jpeg",  img2: "photos/photo(9)p.jpg" ,rotate: -3,  writed: false},
                {name: '"A" + "legal',                      img: "photos/photo(10).jpeg", img2: "photos/photo(10).jpeg",rotate: 12,  writed: false},
                {name: "Minha princessa sorrindo",          img: "photos/photo(11).jpeg", img2: "photos/photo(11)p.jpg",rotate: -8,  writed: false},
                {name: "Acho que falta algo...",            img: "photos/paperEnerg.png", img2: "photos/paperEnergp.png",rotate: 5,   writed: false}
            ];
        }
    }

    function addPhoto(name, img, img2, rotate) {
        photos.push({name: name, img: img, img2: img2, rotate: rotate, writed: false});

        const notification = getEl('photo-notification');
        const notificationText = getEl('photo-notification-text');

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
                    getEl(el.obj).style.display = "none";
                }

                        if (secrets.filter(secret => secret.find).length === secrets.length) {
            getEl('startD').style.display = 'flex';
        }
            });
        } else {
            secrets = [
                {name: '"Aceito"', desc: "Uma eterna e sagrada união <br> da alma e do corpo em um só.", find: false, obj: false},
                {name: "Caneta", desc: "Escrever nossa história <br> para ninguém apagar <br> (vá à galeria)", find: false, obj: "penG"},
                {name: "Barquinho", desc: "Espero poder viajar com você pelo mundo todo <3", find: false, obj: false},
                {name: '"Pedra roxa"', desc: "Uma pedra roxa com uma fita vhs", find: false, obj:"ametista"},
                {name: "Axoloteeee", desc: "Eu criaria um com você (Se não fosse crime ¬¬)", find: false, obj: "axolotl-secret"}
            ];
        }
    }

    loadSecrets();

    getEl('axolotl-secret').addEventListener('click', () => {
        findSecret(4);
        getEl('axolotl-secret').style.display = 'none';
    });

    var miniPaperColect = 0
    var miniPapersColected = {
        "gal": false,
        "mes": false,
        "ext": false
    }

    let data = {};

    function saveData() {
        localStorage.setItem('dataSave', JSON.stringify(data));
    }

    function dataSeting(dataI, value) {
        data[dataI] = value
        saveData()
    }

    var energy = false;

    function loadData() {
        const saved = localStorage.getItem('dataSave');
        if (saved) {
            data = JSON.parse(saved);
            if(data["lightOn"]) {
                energy = true
                getEl("shadow").classList.add('active');
                document.getElementsByClassName('lI')[0].src = "luz2.png";
                document.getElementsByClassName('lI')[1].src = "luz2.png";

                //logica de abertura de div

                document.getElementsByClassName('c-btn')[0].classList.add('active')
                getEl('sdwTxt').style.display = "none"
                document.getElementsByClassName("shadow-content")[0].style.display = "flex"

                getEl('mes').style.pointerEvents = "auto"
                getEl('gal').style.pointerEvents = "auto"
                getEl('mes').style.opacity = '1'
                getEl('gal').style.opacity = '1'
            };
            if(data["alreadOpen"]) {
                getEl("start").style.display = "none"
                const faviconLink = document.getElementById("favicon");
                faviconLink.href = "icon.png";
                const title = document.querySelector('title')
                title.innerHTML = "A Speciar Year"
            }
            miniPaperColect = data["miniPapers"]
            miniPapersColected = data["miniPaper"]

            if(data["miniPaper"]["gal"]) {
                const el = getEl("gal").style
                el.opacity = "0"
                el.pointerEvents = "none"
                if (miniPaperColect == 3) openRadio()
            }

            if(data["miniPaper"]["mes"]) {
                const el = getEl("mes").style
                el.opacity = "0"
                el.pointerEvents = "none"
                if (miniPaperColect == 3) openRadio()
            }

            if(data["miniPaper"]["ext"]) {
                if (document.getElementsByClassName('c-btn')[0].classList.contains('active')) {
                    document.getElementsByClassName('c-btn')[0].classList.remove('active')
                }
                if (miniPaperColect == 3) openRadio()
            }

            if(data["beachOpen"]) {
                beachOpen()
            }

            if(data["foto1"]) {
                const dPD = document.getElementsByClassName("dropedPhotos")[0]
                dPD.style.display = "none"
            }
            if(data["blueTransitionOpened"]) {
                getEl('morena-vhs-btn').style.display = 'block';
                getEl('ametista').style.display = 'none';
            }
        } else {
            data = {
                "lightOn": false,
                "alreadOpen": false,
                "miniPaper": {
                    "gal"/*Sal*/: false,
                    "mes": false,
                    "ext": false
                },
                "miniPapers": 0,
                "beachOpen" : false,
                "foto1": false,
                "blueTransitionOpened": false
            };
        }
    }
    loadData();

    const cardsContainer = getEl('cards-container');
    const letterView = getEl('letter-view');
    const letterContent = getEl('letter-content');
    const letterTitle = getEl('letter-title');
    const letterText = getEl('letter-text');
    const closeLetterBtn = document.querySelector('.close-letter-btn');
    const letterZoomText = getEl('letter-zoom-text');

    let cards = [];

    function saveCards() {
        localStorage.setItem('cardsSave', JSON.stringify(cards));
    }

    function loadCards() {
        const savedCards = localStorage.getItem('cardsSave');
        if (savedCards) {
            cards = JSON.parse(savedCards);

        } else {
            cards = [
                {title: "1 ANO", text: "1, 2, 4, 8, 10, 12... passou rápido? Nah <br> Honestamente, cada momento com você foi especial a um nível que eu não me imagino sem você, afinal, são 12 messes kkk. <br> Eu espero que esse tenha sido só o começo de tudo, um bom começo, mas não um começo fácil, mas eu estou muito feliz em poder superar tudo isso com você, com a pessoa a qual eu quero dedicar a minha vida e meu cuidado, a pessoa que eu quero do meu lado, nos momentos bons e nos ruins, na saúde e na doença<br> espero construir uma família solida com você, ter um casamento saudável e uma casinha, te dar as coisas que você não teve<br><br>Esse é só o começo :)", img: "cards/10636332.jpg", front:"cards/10636332.jpg", rotate: 3, bg: true, imgFill: false, width: "auto"},
                {title: "", text: "", img: "cards/claricePaper.png", front:"cards/capaClaricePaper.png", rotate: -5, bg: true, imgFill: true, width: "428px"},
                {title: "", text: "", img:"cards/cerejeira.png", front:"cards/cerejeira.png", rotate: 3, bg: false, imgFill: true, width: "auto"},
                {title: "Cartinha", text: "yipiii yeay<br> eu to BEM feliz, com esse presente kk, fazer ele foi bem legal, embora tenha sido muito dificil<br>, eu realmente espero que você esteja gostando, esse foi um GRANDE projeto meu kk, assim como nosses :D<br> eu acho que dava pra ter ficado melhor mas é isso, eu n tenho muito tempo mesmo ksksk, <br> <img src='https://blob.gifcities.org/gifcities/4TYHWALHWWEAHAHV3KRYLTEVF4OJMW2U.gif'><br>, eu comecei a fazer ele desde setembro, mas eu realmente to feliz com o resultado, e tudo mais :D", img: "cards/10636332.jpg", front:"cards/10636332.jpg", rotate: -10, bg: true, imgFill: false, width: "auto", find: false}
            ];
        }
    }

    loadCards();

    const musics = [
        {name: "Tudo que eu sempre sonhei", artista: "pullover", file: "musics/Tudo_que_eu_sempre_sonhei.mp3", photo: "https://cdn-images.dzcdn.net/images/cover/33d70251f40848052b216707eff6830f/0x1900-000000-80-0-0.jpg"},
        {name: "Uma arlinda mulher", artista: "Mamonas assasinas", file:"musics/Uma Arlinda Mulher - Mamonas Assassinas - SoundLoadMate.com.mp3", photo: "https://upload.wikimedia.org/wikipedia/pt/5/54/Musicasmamonasassassinas.jpg"},
        {name: "From the Start", artista: "Good Kid", file: "musics/From The Start - Good Kid - SoundLoadMate.com.mp3", photo: "https://i1.sndcdn.com/artworks-6XqQegnVczx7MvGD-oIO41Q-t500x500.jpg"},
        {name: "Como é Grande meu Amor por Você", artista: "Caetano Veloso", file: "musics/01 Como é grande o meu amor por Você.mp3", photo: "c.jpg"},
        {name: "Tek It", artista: "Cafuné", file: "musics/Tek_It_KLICKAUD.mp3" ,photo:"https://i1.sndcdn.com/artworks-000629690896-59t9zn-t1080x1080.jpg"},
        {name: "Her", artista: "JVKE", file: "musics/her_KLICKAUD.mp3", photo: "https://i1.sndcdn.com/artworks-OZdapPajMSfZ-0-t1080x1080.jpg"},
        {name: "undressed", artista: "sombr", file: "musics/undressed_KLICKAUD.mp3", photo: "https://i1.sndcdn.com/artworks-eas5o4uz5miQ-0-t1080x1080.jpg"},
        {name: "rises the moon", artista: "liana flores", file: "musics/rises_the_moon_KLICKAUD.mp3", photo: "https://i1.sndcdn.com/artworks-cG3zkXfFH8MzyrEb-jjbDoQ-t1080x1080.jpg"}
    ];

    totalSecrets.innerHTML = secrets.length;
    secretsNumber.innerHTML = secrets.filter(secret => secret.find).length;

    const allImageUrls = [
        ...photos.map(p => p.img),
        ...photos.map(p => p.img2),
        ...cards.map(c => c.img),
        ...cards.map(c => c.front)
    ];

    let tapes = [];

    function saveTapes() {
        localStorage.setItem('TapesSave', JSON.stringify(tapes));
    }

    function loadTapes() {
        const saved = localStorage.getItem('TapesSave');
        if (saved) {
            tapes = JSON.parse(saved);
        } else {
            tapes = [
                {name: "Stardew Valley" ,img: "tapes/sVTape.png", content: "vhs.mp4", time: 5, find: false},
                {name: "Morena", img: "tapes/vhsBase.png", content: "tapes/Witch Bunny.mp4", find: false},
                {name: "CMD", img: "tapes/cmd.png", content: "tapes/oi.mp4", find: false, password: "IANSICTTSWH"}
            ];
        }
    }
    loadTapes();

    preloadImages(allImageUrls)
        .then(() => {
            enterButton.disabled = false;
            enterButton.textContent = 'Entrar';
        })
        .catch(errorEvent => {
            console.error('Falha ao pré-carregar uma ou mais imagens:', errorEvent);
            enterButton.disabled = false;
            enterButton.textContent = 'Entrar';
        });

    const photosContainer = document.querySelector('.photos-container');
    const writeBtn = getEl('write-btn');
    const eraseBtn = getEl('erase-btn');

         //a
    let photoSelected = 0;
    // Adiciona uma flag para prevenir cliques durante a animação e define a duração.
    let isAnimating = false;
    const animationDuration = 500; // Deve ser igual à duração da transição no CSS (0.5s)

    // Seleciona os elementos da galeria
    const photoEl0 = getEl('photo-0');
    const photoEl1 = getEl('photo-1');
    const photoEl2 = getEl('photo-2');
    const photoEl0Overlay = getEl('photo-0-overlay');
    const photoEl1Overlay = getEl('photo-1-overlay');
    const photoEl2Overlay = getEl('photo-2-overlay');

    const photoNameDisplay = getEl('photoNameDisplay');
    
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
            recycledElement.overlay.style.backgroundImage = `url('${photos[nextIndex].writed? photos[nextIndex].img2 :photos[nextIndex].img}')`;
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
            recycledElement.overlay.style.backgroundImage = `url('${photos[prevIndex].writed? photos[prevIndex].img2 :photos[prevIndex].img}')`;
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
            if (photoSelected == 6) {
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

        left.el.dataset.index = prevIndex;
        center.el.dataset.index = photoSelected;
        right.el.dataset.index = nextIndex;

        if (photoSelected == 6) {
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
        const secretMsgName = getEl('secretMsgName');
        const secretMsgText = getEl('secretMsgText');
        secretMsgText.innerHTML = '';
        secretMsgName.innerHTML = secrets[secretId].name;
        overlay.classList.add('visible');
        
        const descText = secrets[secretId].desc;
        const typingSpeed = 40;
        const animationStartDelay = 700;
        const magicSecret = getEl('magicSecret');
        
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

        if (secrets.filter(secret => secret.find).length === secrets.length) {
            getEl('startD').style.display = 'flex';
        }
    }

    overlay.addEventListener('click', (event) => {
        if (event.target === overlay && !overlay.classList.contains('hiding')) {
            overlay.classList.add('hiding');
            setTimeout(() => {
                overlay.classList.remove('visible', 'hiding');
            }, 400);
        }
    });

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
        saveCards()
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

        if (cardData.width != "auto") {
            letterContent.style.width = cardData.width;
        }
        else {
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
    
    const audioPlayer = getEl('audio');
    const pauseBtn = getEl("pause-btn");
    const musicThumbFill = getEl("music-thumb-fill");
    const musicsD = getEl('musics');

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
        if (musicSelectedN == null) return;
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

    const penG = getEl("penG");
    penG.addEventListener("click", () => {
        findSecret(1);
        penG.style.display = "none";
    });
    
    
    function energyFill() {
        const energyOverlay = getEl('energyOverlay');
        const energyText = energyOverlay.querySelector('.energyText');
        const text = energyText.textContent;

        getEl('energyOverlay').classList.add("active");
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

        getEl("shadow").classList.add('active');
        document.getElementsByClassName('lI')[0].src = "luz2.png";
        document.getElementsByClassName('lI')[1].src = "luz2.png";

        //logica de abertura de div

        document.getElementsByClassName('c-btn')[0].classList.add('active')
        getEl('sdwTxt').style.display = "none"
        document.getElementsByClassName("shadow-content")[0].style.display = "flex"

        setTimeout(() => {
        
            getEl('mes').style.pointerEvents = "auto"
            getEl('gal').style.pointerEvents = "auto"
            getEl('mes').style.opacity = '1'
            getEl('gal').style.opacity = '1'
        }, 100);

        dataSeting("lightOn", true);

    }

    document.getElementsByClassName('energyBtn')[0].addEventListener("click", function() {
        getEl("energyOverlay").style.opacity = "0"
        getEl("energyOverlay").style.pointerEvents = "none"
        setTimeout(function() {
            getEl("energyOverlay").style.display = "none"
        }, 6000)
    })

    getEl('mes').addEventListener('click', function(){ miniPaperOpen(0)})
    getEl('gal').addEventListener('click', function(){ miniPaperOpen(1)})


    const miniPapers = [
        {id: 'mes', photoName: "MiniLLicia :O", photoFile:"photos/cute (3).jpg", photoDFile: "photos/cute (3)d.jpg",rotate:  -2},
        {id: 'gal', photoName: "Miau :3", photoFile:"photos/cute (2).jpg", photoDFile: "photos/cute (2)d.jpg", rotate: -10},
        {id: 'ext', photo: "COISINHA LINDAAAA", photoFile:"photos/cute (1).jpg", photoDFile: "photos/cute (1)d.jpg", rotate: 6}
    ]
    
    document.getElementsByClassName('c-btn')[0].addEventListener('click', futurePapers)

    const futurePapersL = [
        {color: "red", text: "Quero ter uma casinha com você <3"},
        {color: "blue", text: "Nossa casinha vai ter varias coisas velhas kk"},
        {color: "yellow", text: "AYLINHAAA <3"},
        {color: "white", text: "esse codigo tem mais de 1242 linhas de JS" },
        {color: "red", text: "365 dias"},
        {color: "red", text: "8766 horas"},
        {color: "red", text: "525960 minutos"},
        {color: "red", text: "~3,156e+7 segundos"},
        {color: "red", text: "Mais de 10.000 mensagens"},
        {color: "red", text: "Mais de 3000 litros de água"},
        {color: "red", text: "36,5 milhões de batimentos cardiacos"},
        {color: "yellow", text: "Vestir aquelas roupas bem bregas com vc kk"},
        {color: "blue", text: "eu Te amo"},
        {color: "blue", text: "愛してます"},
        {color: "blue", text: "Je t'aime"},
        {color: "blue", text: "σε αγαπώ"},
        {color: "blue", text: "사랑해요"},
        {color: "blue", text: "Ich liebe dich"},
        {color: "blue", text: "Я тебя люблю"},
        {color: "我愛你", text: "我愛你"},
        {color: "yellow", text: "Imagina ser tipo o centro de reunião do grupinho de Ayla"},
        {color: "yellow", text: "Espero que Deus acompanhe a gente para sempre"},
        {color: "yellow", text: "Não vou fazer sua mãe se arrepender!"},
        {color: "yellow", text: "-Eu tô te seguindo."},
        {color: "yellow", text: "--Panetone Salgado"},
        {color: "green", text: "O primeiro"},
        {color: "green", text: "Quero dançar com você"},
        {color: "green", text: "MINEPOEM"},
        {color: "purple", text: "Iaeee :D 1"},
        {color: "purple", text: "Allícia = Meu amor 2"},
        {color: "purple", text: "Não entendo por que, mas te amo desde de quando te vi 3"},
        {color: "purple", text: "Sempre vou te amar 4"},
        {color: "purple", text: "Incrivel como você está nos meus melhores sonhos. 5"},
        {color: "purple", text: "Com você meus dias são melhores. 6"},
        {color: "purple", text: "Te amo para todo o sempre. 7"},
        {color: "purple", text: "Te acho incrivel. 8"},
        {color: "purple", text: "Sempre iluminando meus dias ruins. 9"},
        {color: "purple", text: "WORLD IS SMALL WITH U. 10"},
        {color: "purple", text: "Hello my love :DD 11"},
        {color: "red", text: "O codigo será todas a primeira letra das cartas roxas"}
    ]

    
    const futurePaperD = getEl('futurePaperBox')
    const futurePaper = getEl('futurePaper')
    const futurePaperText = getEl('futurePaperText')
    const MINEPOEM = "Era uma vez um jogador.<br>O jogador era você, abc.<br>Às vezes, ele se considerava humano, na fina crosta de um globo giratório de rocha derretida. A esfera de rocha derretida circundava uma esfera de gás em chamas trezentas e trinta mil vezes mais massiva que ela. Estavam tão distantes que a luz levava oito minutos para atravessar a lacuna. A luz era informação de uma estrela e podia queimar sua pele a cento e cinquenta milhões de quilômetros de distância.<br>Às vezes, o jogador sonhava que era um mineiro, na superfície de um mundo plano e infinito. O sol era um quadrado branco. Os dias eram curtos; havia muito a fazer; e a morte era um inconveniente temporário.<br>Às vezes, o jogador sonhava que estava perdido em uma história.<br>Às vezes, o jogador sonhava que eram outras coisas, em outros lugares. Às vezes, esses sonhos eram perturbadores. Às vezes, realmente lindos. Às vezes, o jogador acordava de um sonho para outro, e depois acordava deste para um terceiro.<brÀs vezes, o jogador sonhava que estava assistindo a palavras em uma tela.<br>Vamos voltar.<br>Os átomos do tocador estavam espalhados na grama, nos rios, no ar, no chão. Uma mulher reuniu os átomos; ela bebeu, comeu e inalou; e a mulher reuniu o tocador em seu corpo.<br>E o jogador acordou do mundo quente e escuro do corpo de sua mãe para um longo sonho.<br>E o jogador era uma nova história, nunca contada antes, escrita em letras de DNA. E o jogador era um novo programa, nunca executado antes, gerado por um código-fonte com um bilhão de anos. E o jogador era um novo ser humano, nunca antes vivo, feito de nada além de leite e amor.<br>Você é o jogador. A história. O programa. O ser humano. Feito apenas de leite e amor.<br>"
    
    const colors = {
        "red": "#FF6961",
        "blue": "#0faec3ff",
        "yellow": "#FDFD96",
        "green": "#8fff89ff",
        "purple": "#DDA0DD"
    }

    function futurePapers() {
        //verificar se tem a classe 'active'
        if (document.getElementsByClassName('c-btn')[0].classList.contains('active')) {
            miniPaperOpen(2)
            document.getElementsByClassName('c-btn')[0].classList.remove('active')
            return;
        }

        futurePaperD.classList.add('active')
        const number = getRandomIntInclusive(0, futurePapersL.length - 1)
        const value = futurePapersL[number]
        const paper = {text: value.text, color: value.color}

        futurePaperText.innerHTML = paper.text
        futurePaper.style.backgroundColor = colors[paper.color]

        if(paper.text == "MINEPOEM") {
            futurePaperText.innerHTML = MINEPOEM
            futurePaperText.classList.add('MINEPOEM')
        }

    }

    function getRandomIntInclusive(min, max) {
        min = Math.ceil(min); // Ensure min is an integer
        max = Math.floor(max); // Ensure max is an integer
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    futurePaperD.addEventListener('click', function() {
        futurePaperD.classList.remove('active')
        futurePaperText.classList.remove('MINEPOEM')

    })

    function miniPaperOpen(id) {
        if (miniPaperColect > 3) return;

        addPhoto(miniPapers[id].photoName, miniPapers[id].photoFile, miniPapers[id].photoDFile, miniPapers[id].rotate)
        miniPapersColected[miniPapers[id].id] = true;

        dataSeting("miniPaper", miniPapersColected)

        miniPaperColect += 1;
        dataSeting("miniPapers", miniPaperColect)

        if (id != 2) {
            const el = getEl(miniPapers[id].id).style
            el.opacity = "0"
            el.pointerEvents = "none"
        }

        getEl("miniPaperLight").classList.add('active')
        setTimeout(() => {
            getEl("miniPaperLight").classList.remove('active')
        }, 2010);

        if (miniPaperColect == 3) {
            openRadio()
        }
    }

    function openRadio() {
        document.getElementsByClassName('rTop')[0].style.display = 'none'
        document.getElementsByClassName('rCon')[0].style.display = "flex"
    }

    const input = getEl('password');

    // Detecta quando o usuário pressiona Enter ou envia pelo mobile
    input.addEventListener('keydown', function(e) {
        if (e.key === 'Enter') {
            e.preventDefault(); // Evita recarregar a página em formulários
            enviarMensagem();
        }
    });

    // Também cobre caso o navegador dispare evento 'change' ou 'input' em teclados móveis
    input.addEventListener('change', function() {
        if (input.value.trim() !== '') {
            enviarMensagem();
        }
    });

    const senhaD = 'YLOCCEEYLOVO'

    function enviarMensagem() {
        const valor = input.value.trim();
        if (!valor) return; // ignora se estiver vazio
        const senha = getEl('password').value

        if (senha == senhaD) {
            const start = getEl("start")
            const sText = getEl("start-p")



            const text = sText.textContent
            sText.textContent = ''
            getEl('s-1').style.display = "none"
            getEl('s-2').style.opacity = "1"

            setTimeout(typeWriter, 200);

            let i = 0
            function typeWriter() {
                if (i < text.length) {
                    sText.innerHTML += text.charAt(i);
                    i++;
                    setTimeout(typeWriter, 100); // Velocidade de digitação
                }
                else {
                   getEl("start-pc").style.opacity = "1"
                    setTimeout(() => {
                        start.style.opacity = "0"
                        start.style.pointerEvents = "none"
                        dataSeting("alreadOpen", true)
                        const faviconLink = document.getElementById("favicon");
                        faviconLink.href = "icon.png";
                        const title = document.querySelector('title')
                        title.innerHTML = "A Speciar Year"
                    }, 2000)
                }
            }
        
        }
        else {
            let text;
            if (senha == "?") {
                text = "> Dica: senha Caixa";
            }
            else {
                text = "> Senha Errada! Tente novamente";
            }

            const spanT = document.createElement('span')
            spanT.innerHTML = "> " + senha
            getEl('s1Text').appendChild(spanT)
            const span = document.createElement('span')
            span.innerHTML = text
            getEl('s1Text').appendChild(span)

        }
    }



    const dPD = document.getElementsByClassName("dropedPhotos")[0]

    dPD.addEventListener('click', function() {
        dPD.style.display = "none"
        addPhoto("Prainha :D", "photos/476416045_1839096826863128_8273132225842945347_n.jpg", "photos/476416045_1839096826863128_8273132225842945347_np.jpg", 10)
        addPhoto("ZAWARADOOO", "photos/480105046_1055557732998374_2302750445809161488_n.jpg", "photos/480105046_1055557732998374_2302750445809161488_np.jpg", 5)
        addPhoto("//O-O//",    "photos/480972682_28470636085918533_4271527333404328933_n.jpg", "photos/480972682_28470636085918533_4271527333404328933_np.jpg", -3)
        renderPhotos()
        dataSeting("foto1", true)
    })

    var frequency = 5.5
    getEl('left-radio').addEventListener('click', function() {
        if (frequency == 0) return;

        frequency -= 0.5

        document.getElementsByClassName("rCon")[0].style.backgroundImage = "url('radioEsquerda.png')"
        setTimeout(() => {
            if (frequency != 7.5) {
                document.getElementsByClassName("rCon")[0].style.backgroundImage = "url('radioBase.png')"
            }
        }, 700);

        radioF()

    })

    getEl('right-radio').addEventListener('click', function() {
        if (frequency == 10) return;
        
        frequency += 0.5

        document.getElementsByClassName("rCon")[0].style.backgroundImage = "url('radioDireita.png')"
        setTimeout(() => {
            if (frequency != 7.5) {
                document.getElementsByClassName("rCon")[0].style.backgroundImage = "url('radioBase.png')"
            }
        }, 700);

        radioF()
    })
    
    function radioF() {

        getEl('frequency').innerHTML = frequency

        if (document.getElementsByClassName("rCon")[0].classList.contains('active')) {

            document.getElementsByClassName("rCon")[0].style.backgroundImage = "url('radioBase.png')"

        }
        document.getElementsByClassName("rCon")[0].classList.remove('active')

        if (frequency != 7.5) return;

        
        document.getElementsByClassName("rCon")[0].classList.add('active')
        
        
        setTimeout(() => {
            document.getElementsByClassName("rCon")[0].style.backgroundImage = "none"
        }, 100);
        
        setTimeout(() => {
            if(frequency == 7.5) {
                beachOpen() //AAEEEEEEEEEEEE 
                dataSeting("beachOpen", true)
            }
        }, 5000)
    }

    function beachOpen() {
        document.getElementsByClassName('rBtn')[0].style.display = "flex"
        document.getElementsByClassName("rCon")[0].style.display = "none"
    }

  const rBtn = document.querySelector('.rBtn');
  const blueTransition = document.getElementById('blueTransition');
  
  if (rBtn && blueTransition) {
    rBtn.addEventListener('click', () => {
      document.body.classList.add('zooming');

      setTimeout(() => {
        blueTransition.classList.add('active');
        if (!data.blueTransitionOpened) {
            dataSeting("blueTransitionOpened", true);
            getEl('morena-vhs-btn').style.display = 'block';
            getEl('ametista').style.display = 'none';
        }
      }, 400);

      setTimeout(() => {
        document.body.classList.remove('zooming');
      }, 1000);
    });
  }

  const GamePhotosQ = 10;
  var GamePhotoN = 1;

  getEl('gameBtnLeft').addEventListener('click', function() {
    if (GamePhotoN != 1) {
        GamePhotoN-- 
    }
    else {
        GamePhotoN = GamePhotosQ;
    }
    standBy(1.2)
  })

  getEl('gameBtnRight').addEventListener('click', function() {
    if (GamePhotoN != GamePhotosQ) {
        GamePhotoN++
    }
    else {
        GamePhotoN = 1;
    }
    standBy(1.2)
  })

    function standBy(sec) {
        const psb = getEl("PSB")
        
        psb.style.display = "block"
        psb.play()
        
        setTimeout(() => {
            psb.style.display = "none"
            psb.pause()
            psb.currentTime = 0
        }, sec * 1000);

        getEl('gamePhoto').src = "game/gamePhoto (" + GamePhotoN + ").png"
    }

    document.getElementsByClassName('backBtn')[0].addEventListener('click', function() {
        blueTransition.classList.remove('active');
    })
    
    document.getElementsByClassName("ship")[0].addEventListener('click', function(){
        findSecret(2)    
    })

    document.getElementsByClassName("letterAdd")[0].addEventListener('click', function(){
        cards[3].find = true
        addCard(3)
        document.getElementsByClassName("letterAdd")[0].style.display = "none"
    })

    getEl('ametista').addEventListener('click', function() {
        if (tapes[0] && !tapes[0].find) {
            tapes[0].find = true;
            saveTapes();

            const notification = getEl('photo-notification');
            const notificationText = getEl('photo-notification-text');

            notificationText.textContent = "Nova fita encontrada!";
            notification.classList.add('show');

            setTimeout(() => {
                notification.classList.remove('show');
            }, 3000);

            getEl('ametista').style.display = 'none';
        }
        findSecret(3); // Call findSecret for the "Pedra roxa" secret
    });

    getEl('morena-vhs-btn').addEventListener('click', function() {
        if (tapes[1] && !tapes[1].find) {
            tapes[1].find = true;
            saveTapes();

            const notification = getEl('photo-notification');
            const notificationText = getEl('photo-notification-text');

            notificationText.textContent = "Nova fita encontrada!";
            notification.classList.add('show');

            setTimeout(() => {
                notification.classList.remove('show');
            }, 3000);

            this.style.display = 'none';
        }
    });

    getEl('cmd-vhs-trigger').addEventListener('click', function() {
        if (tapes[2] && !tapes[2].find) {
            tapes[2].find = true;
            saveTapes();

            const notification = getEl('photo-notification');
            const notificationText = getEl('photo-notification-text');

            notificationText.textContent = "Nova fita encontrada!";
            notification.classList.add('show');

            setTimeout(() => {
                notification.classList.remove('show');
            }, 3000);

            this.style.display = 'none';
        }
    });


    getEl('vhsBtn').addEventListener('click', function() {
        getEl('vhsChoiser').classList.add("active")
        tapeLoad()
    })

    var tapeS = 0;

    getEl("leftTape").addEventListener('click', function() {

        if( tapeS == 0) {
            tapeS = tapesHave.length-1
        }
        else {
            tapeS--
        }

        tapeLoad()
    })

    getEl("rightTape").addEventListener('click', function() {

        if( tapeS == tapesHave.length-1) {
            tapeS = 0
        }
        else {
            tapeS++
        }
        
        tapeLoad()
    })

    var tapesHave = []

    function tapeLoad() {
        tapesHave = []
        for (let i = 0; i < tapes.length; i++) {
            const element = tapes[i];
            if(element.find){
                tapesHave.push(element)
            }
            
        }
        if (tapesHave.length == 0 ){
            getEl('nullVhs').style.display = "block"
            return;
        }

        getEl('nullVhs').style.display = "none"
        getEl('vhsImg').src = tapesHave[tapeS].img;

    }

    const vhsPlayer = getEl('vhsPlayer');
    const vhsImg = getEl('vhsImg');
    const vhsChoiser = getEl('vhsChoiser');
    const imgDisplay = document.querySelector('.imgDisplay');

    vhsImg.addEventListener('click', () => {
        if (tapesHave.length === 0) return;

        const selectedTape = tapesHave[tapeS];

        if (selectedTape.password) {
            const password = prompt("Digite a senha para esta fita:");
            if (password === selectedTape.password) {
                vhsChoiser.classList.remove('active');
                imgDisplay.style.display = 'none';
                
                vhsPlayer.src = selectedTape.content;
                vhsPlayer.style.display = 'block';
                vhsPlayer.play();
            } else {
                alert("Senha incorreta!");
            }
        } else {
            vhsChoiser.classList.remove('active');
            imgDisplay.style.display = 'none';
            
            vhsPlayer.src = selectedTape.content;
            vhsPlayer.style.display = 'block';
            vhsPlayer.play();
        }
    });

    vhsPlayer.addEventListener('ended', () => {
        vhsPlayer.style.display = 'none';
        imgDisplay.style.display = 'flex';
    });

    document.getElementsByClassName('vhsBack')[0].addEventListener("click",function() {
        vhsChoiser.classList.remove('active');
    })
    renderPhotos()
    updatePhotoNameWithFade()

    addCard(0);
    addCard(1);
    addCard(2);
    
    if (cards[3] && cards[3].find) {
        addCard(3);
        document.getElementsByClassName("letterAdd")[0].style.display = "none";
    }

    const chat = [
        "O que você acha disso?",
        "- Disso o que?",
        "Disso tudo.",
        "- Seja mais expecifico",
        "Dessa jornada.",
        "- Odisseia?",
        "Talvez Crônica",
        "- Acho que...",
        "- É só o começo.",
        "Silêncio! Eles estão vindo!"
    ]

    var chatS = 0
    var isTyping = false;

    function typeWriter(element, text, callback) {
        let i = 0;
        element.innerHTML = '';
        const speed = 50; // speed in milliseconds
        isTyping = true;
        getEl('chatBtn').disabled = true;

        function type() {
            if (i < text.length) {
                element.innerHTML += text.charAt(i);
                i++;
                setTimeout(type, speed);
            } else {
                isTyping = false;
                getEl('chatBtn').disabled = false;
                if (callback) {
                    callback();
                }
            }
        }
        type();
    }

    getEl("startB").addEventListener('click', function(){
        getEl('remember').style.display = "flex"
        getEl('remember').style.opacity = "1"
        typeWriter(getEl('chatText'), chat[0]);
    })
    
    getEl('chatBtn').addEventListener('click', function() {
        if (isTyping) return;

        if (chatS >= chat.length - 1) {
            showStart()
            return;
        }
        chatS++
        typeWriter(getEl('chatText'), chat[chatS]);
    })
    
    function showStart() {
        const rememberEl = getEl('remember');
        const chatEl = getEl('chat');
        const rBody = getEl('Rbody');

        if (chatEl) {
            chatEl.style.transition = 'opacity 0.5s';
            chatEl.style.opacity = '0';
            setTimeout(() => {
                chatEl.style.display = 'none';
            }, 500);
        }

        if (rBody) {
            rBody.style.display = 'block';
            rBody.style.transform = 'scale(0.5)';
            rBody.style.opacity = '0';
            rBody.style.transition = 'transform 1s ease-in-out, opacity 1s ease-in-out';

            setTimeout(() => {
                rBody.style.transform = 'scale(1)';
                rBody.style.opacity = '1';
            }, 100);
        }
    }
    /**
     * 
     * @param {string} id 
     * @returns element
     */

    function getEl(id) {
        return document.getElementById(id);
    }

});
