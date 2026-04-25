import { auth } from '../0_firebase_api_config.js';

let userDataCache = null;

// Função segura para obter usuário atual (sempre verifica no Firebase)
export async function getCurrentUser() {
    return new Promise((resolve) => {
        const unsubscribe = auth.onAuthStateChanged(async (user) => {
            unsubscribe();
            if (user) {
                resolve(user);
            } else {
                resolve(null);
            }
        });
    });
}

// Verificar se o usuário está autenticado (FORÇA VERIFICAÇÃO NO FIREBASE)
export async function isAuthenticated() {
    const user = await getCurrentUser();
    return user !== null;
}

// Obter token ID do Firebase (para validações no backend)
export async function getIdToken() {
    const user = await getCurrentUser();
    if (user) {
        return await user.getIdToken();
    }
    return null;
}

// Verificar permissão específica (sempre verifica no Firebase)
export async function verificarPermissao(permissaoNecessaria) {
    try {
        const user = await getCurrentUser();
        if (!user) return false;
        
        // Buscar dados atualizados do Firestore
        const { db, doc, getDoc, query, collection, where, getDocs } = await import('../0_firebase_api_config.js');
        
        const loginsRef = collection(db, 'logins');
        const q = query(loginsRef, where('email', '==', user.email));
        const querySnapshot = await getDocs(q);
        
        if (!querySnapshot.empty) {
            let userData = null;
            querySnapshot.forEach((doc) => {
                userData = doc.data();
            });
            
            // Verificar permissão baseada no perfil/cargo
            switch(permissaoNecessaria) {
                case 'admin':
                    return userData.perfil === 'admin';
                case 'funcionario':
                    return userData.cargo !== 'Cliente';
                case 'cliente':
                    return userData.cargo === 'Cliente';
                default:
                    return true;
            }
        }
        
        return false;
    } catch (error) {
        console.error('Erro ao verificar permissão:', error);
        return false;
    }
}

// Aplicar background
export function aplicarBackground(telaId, perfil) {
    const mainContent = document.getElementById('mainContent');
    if (!mainContent) return;
    
    const backgrounds = {
        'home_clientes': 'url("../imagens/backgrounds/background_home_clientes.png")',
        'home_funcionarios': 'url("../imagens/backgrounds/background_home_funcionarios.png")',
        'agendamentos_clientes': 'url("../imagens/backgrounds/background_agendamentos_clientes.png")',
        'agendamentos_funcionarios': 'url("../imagens/backgrounds/background_agendamentos_funcionarios.png")',
        'palestras_clientes': 'url("../imagens/backgrounds/background_palestras_clientes.png")',
        'palestras_funcionarios': 'url("../imagens/backgrounds/background_palestras_funcionarios.png")',
        'cursos_clientes': 'url("../imagens/backgrounds/background_cursos_clientes.png")',
        'cursos_funcionarios': 'url("../imagens/backgrounds/background_cursos_funcionarios.png")',
        'cadastros_funcionarios': 'url("../imagens/backgrounds/background_cadastros_funcionarios.png")'
    };
    
    let backgroundKey = '';
    const isCliente = (perfil === 'Cliente' || perfil === 'cliente');
    
    switch(telaId) {
        case 'home':
            backgroundKey = isCliente ? 'home_clientes' : 'home_funcionarios';
            break;
        case 'clientes_agendamentos':
            backgroundKey = 'agendamentos_clientes';
            break;
        case 'clientes_palestras':
            backgroundKey = 'palestras_clientes';
            break;
        case 'clientes_cursos':
            backgroundKey = 'cursos_clientes';
            break;
        case 'funcionarios_agendamentos':
            backgroundKey = 'agendamentos_funcionarios';
            break;
        case 'funcionarios_palestras':
            backgroundKey = 'palestras_funcionarios';
            break;
        case 'funcionarios_cursos':
            backgroundKey = 'cursos_funcionarios';
            break;
        case 'funcionarios_cadastros':
            backgroundKey = 'cadastros_funcionarios';
            break;
        default:
            backgroundKey = isCliente ? 'home_clientes' : 'home_funcionarios';
    }
    
    if (backgrounds[backgroundKey]) {
        mainContent.style.backgroundImage = backgrounds[backgroundKey];
        mainContent.style.backgroundSize = 'cover';
        mainContent.style.backgroundPosition = 'center';
        mainContent.style.backgroundAttachment = 'fixed';
        mainContent.style.backgroundRepeat = 'no-repeat';
        
        const contentWrapper = document.querySelector('.content-wrapper');
        if (contentWrapper) {
            contentWrapper.style.backgroundColor = 'rgba(255, 255, 255, 0.9)';
            contentWrapper.style.borderRadius = '10px';
            contentWrapper.style.margin = '20px';
            contentWrapper.style.padding = '20px';
            contentWrapper.style.minHeight = 'calc(100vh - 100px)';
        }
    }
}

// Carregar menu
export function carregarMenu(cargo, userData) {
    let menuItems = [];
    const isCliente = (cargo === 'Cliente' || cargo === 'cliente');
    
    if (isCliente) {
        menuItems = [
            { id: 'home', nome: 'Home', icon: 'fa-home' },
            { id: 'clientes_agendamentos', nome: 'Meus Agendamentos', icon: 'fa-calendar-alt' },
            { id: 'clientes_palestras', nome: 'Palestras Online', icon: 'fa-video' },
            { id: 'clientes_cursos', nome: 'Cursos', icon: 'fa-graduation-cap' }
        ];
    } else {
        menuItems = [
            { id: 'home', nome: 'Home', icon: 'fa-home' },
            { id: 'funcionarios_agendamentos', nome: 'Agendamentos', icon: 'fa-calendar-check' },
            { id: 'funcionarios_palestras', nome: 'Gestão de Palestras', icon: 'fa-chalkboard-user' },
            { id: 'funcionarios_cursos', nome: 'Gestão de Cursos', icon: 'fa-book-open' },
            { id: 'funcionarios_cadastros', nome: 'Gestão de Cadastros', icon: 'fa-users-gear' }
        ];
    }
    
    const navMenu = document.getElementById('navMenu');
    if (navMenu) {
        navMenu.innerHTML = menuItems.map(item => `
            <li>
                <a class="dropdown-item" href="#" data-tela="${item.id}">
                    <i class="fas ${item.icon} me-2"></i>${item.nome}
                </a>
            </li>
        `).join('');
        
        document.querySelectorAll('[data-tela]').forEach(link => {
            link.addEventListener('click', async (e) => {
                e.preventDefault();
                const telaId = link.getAttribute('data-tela');
                
                // Verificar autenticação antes de carregar tela
                const autenticado = await isAuthenticated();
                if (!autenticado) {
                    mostrarNotificacao('Sessão expirada. Faça login novamente.', 'error');
                    window.location.reload();
                    return;
                }
                
                await carregarTela(telaId, userData);
                
                if (window.innerWidth < 768) {
                    const dropdownToggle = document.querySelector('[data-bs-toggle="dropdown"]');
                    if (dropdownToggle) {
                        bootstrap.Dropdown.getInstance(dropdownToggle)?.hide();
                    }
                }
            });
        });
    }
}

// Carregar tela
export async function carregarTela(telaId, userData) {
    const contentArea = document.getElementById('contentArea');
    if (!contentArea) return;
    
    // Verificar autenticação novamente por segurança
    const autenticado = await isAuthenticated();
    if (!autenticado && telaId !== 'home') {
        mostrarNotificacao('Sessão expirada', 'error');
        window.location.reload();
        return;
    }
    
    contentArea.innerHTML = `
        <div class="text-center py-5">
            <div class="spinner-border text-primary" role="status">
                <span class="visually-hidden">Carregando...</span>
            </div>
            <p class="mt-2">Carregando tela...</p>
        </div>
    `;
    
    try {
        let modulo;
        switch(telaId) {
            case 'home':
                modulo = await import('./home.js');
                break;
            case 'clientes_agendamentos':
                modulo = await import('./clientes_agendamentos.js');
                break;
            case 'clientes_palestras':
                modulo = await import('./clientes_palestras.js');
                break;
            case 'clientes_cursos':
                modulo = await import('./clientes_cursos.js');
                break;
            case 'funcionarios_agendamentos':
                modulo = await import('./funcionarios_agendamentos.js');
                break;
            case 'funcionarios_palestras':
                modulo = await import('./funcionarios_palestras.js');
                break;
            case 'funcionarios_cursos':
                modulo = await import('./funcionarios_cursos.js');
                break;
            case 'funcionarios_cadastros':
                modulo = await import('./funcionarios_cadastros.js');
                break;
            default:
                throw new Error('Tela não encontrada');
        }
        
        if (modulo && modulo.renderizar) {
            await modulo.renderizar(contentArea, userData);
            const perfil = userData?.cargo || 'cliente';
            aplicarBackground(telaId, perfil);
        } else {
            throw new Error('Função renderizar não encontrada');
        }
    } catch (error) {
        console.error('Erro ao carregar tela:', error);
        contentArea.innerHTML = `
            <div class="alert alert-danger m-3">
                <i class="fas fa-exclamation-triangle me-2"></i>
                Erro ao carregar tela: ${error.message}
            </div>
        `;
    }
}

// Mostrar notificação
export function mostrarNotificacao(mensagem, tipo = 'success') {
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert alert-${tipo} alert-dismissible fade show position-fixed top-0 end-0 m-3`;
    alertDiv.style.zIndex = '9999';
    alertDiv.style.minWidth = '300px';
    alertDiv.style.zIndex = '10000';
    alertDiv.innerHTML = `
        <i class="fas ${tipo === 'success' ? 'fa-check-circle' : tipo === 'error' ? 'fa-exclamation-circle' : 'fa-info-circle'} me-2"></i>
        ${mensagem}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;
    document.body.appendChild(alertDiv);
    
    setTimeout(() => {
        alertDiv.remove();
    }, 4000);
}

// Formatar data
export function formatarData(data) {
    if (!data) return 'Data não informada';
    const date = new Date(data);
    return date.toLocaleDateString('pt-BR');
}
