import { signOut, auth } from '../0_firebase_api_config.js';

// Variáveis globais
let menuItems = [];
let currentUser = null;
let currentTela = 'home';

// Função para definir o background baseado na tela e perfil
export function aplicarBackground(telaId, perfil) {
    const mainContent = document.getElementById('mainContent');
    if (!mainContent) return;
    
    // Mapeamento de backgrounds
    const backgrounds = {
        // Cliente
        'home_clientes': 'url("../imagens/backgrounds/background_home_clientes.png")',
        'agendamentos_clientes': 'url("../imagens/backgrounds/background_agendamentos_clientes.png")',
        'palestras_clientes': 'url("../imagens/backgrounds/background_palestras_clientes.png")',
        'cursos_clientes': 'url("../imagens/backgrounds/background_cursos_clientes.png")',
        // Funcionário
        'home_funcionarios': 'url("../imagens/backgrounds/background_home_funcionarios.png")',
        'agendamentos_funcionarios': 'url("../imagens/backgrounds/background_agendamentos_funcionarios.png")',
        'palestras_funcionarios': 'url("../imagens/backgrounds/background_palestras_funcionarios.png")',
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
        
        // Adicionar overlay para melhor legibilidade
        mainContent.style.position = 'relative';
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

// Função para carregar o menu baseado no cargo
export function carregarMenu(cargo) {
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
    
    // Atualizar o menu dropdown
    const navMenu = document.getElementById('navMenu');
    if (navMenu) {
        navMenu.innerHTML = menuItems.map(item => `
            <li>
                <a class="dropdown-item" href="#" data-tela="${item.id}">
                    <i class="fas ${item.icon} me-2"></i>${item.nome}
                </a>
            </li>
        `).join('');
        
        // Adicionar event listeners para os itens do menu
        document.querySelectorAll('[data-tela]').forEach(link => {
            link.addEventListener('click', async (e) => {
                e.preventDefault();
                const telaId = link.getAttribute('data-tela');
                currentTela = telaId;
                await carregarTela(telaId, currentUser);
                
                // Fechar o dropdown após clicar (mobile)
                const dropdownMenu = document.querySelector('.dropdown-menu');
                if (dropdownMenu && window.innerWidth < 768) {
                    const dropdownToggle = document.querySelector('[data-bs-toggle="dropdown"]');
                    if (dropdownToggle) {
                        bootstrap.Dropdown.getInstance(dropdownToggle)?.hide();
                    }
                }
            });
        });
    }
}

// Função para carregar a tela baseado no ID
export async function carregarTela(telaId, userData) {
    const contentArea = document.getElementById('contentArea');
    currentUser = userData;
    
    if (!contentArea) return;
    
    // Mostrar loading
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
            // Aplicar background específico da tela
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

// Verificar sessão do usuário
export async function verificarSessao() {
    const sessionData = localStorage.getItem('userSession');
    if (sessionData) {
        currentUser = JSON.parse(sessionData);
        return currentUser;
    }
    return null;
}

// Logout
export async function logout() {
    try {
        localStorage.removeItem('userSession');
        currentUser = null;
        if (auth && signOut) {
            await signOut(auth);
        }
        // Limpar menu
        const navMenu = document.getElementById('navMenu');
        if (navMenu) {
            navMenu.innerHTML = '';
        }
        // Resetar para tela de login
        const contentArea = document.getElementById('contentArea');
        if (contentArea) {
            contentArea.innerHTML = `
                <div class="text-center py-5">
                    <i class="fas fa-sign-in-alt fa-3x text-primary mb-3"></i>
                    <h3>Faça login para continuar</h3>
                    <p>Clique no botão Login no canto superior direito</p>
                </div>
            `;
        }
        aplicarBackground('home', 'cliente');
    } catch (error) {
        console.error('Erro ao fazer logout:', error);
    }
}

// Formatar data
export function formatarData(data) {
    if (!data) return 'Data não informada';
    const date = new Date(data);
    return date.toLocaleDateString('pt-BR');
}

// Formatar data e hora
export function formatarDataHora(data) {
    if (!data) return 'Data não informada';
    const date = new Date(data);
    return date.toLocaleString('pt-BR');
}

// Mostrar notificação
export function mostrarNotificacao(mensagem, tipo = 'success') {
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert alert-${tipo} alert-dismissible fade show position-fixed top-0 end-0 m-3`;
    alertDiv.style.zIndex = '9999';
    alertDiv.style.minWidth = '300px';
    alertDiv.innerHTML = `
        <i class="fas ${tipo === 'success' ? 'fa-check-circle' : tipo === 'danger' ? 'fa-exclamation-circle' : 'fa-info-circle'} me-2"></i>
        ${mensagem}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;
    document.body.appendChild(alertDiv);
    
    setTimeout(() => {
        alertDiv.remove();
    }, 3000);
}

// Validar formulário
export function validarFormulario(dados, camposObrigatorios) {
    const erros = [];
    for (const campo of camposObrigatorios) {
        if (!dados[campo] || dados[campo].trim() === '') {
            erros.push(`Campo ${campo} é obrigatório`);
        }
    }
    return erros;
}

// Gerar ID único
export function gerarIdUnico() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

// Debounce para evitar chamadas excessivas
export function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Verificar se é mobile
export function isMobile() {
    return window.innerWidth <= 768;
}

// Recarregar menu atual
export function recarregarMenu() {
    if (currentUser) {
        carregarMenu(currentUser.cargo);
    }
}
