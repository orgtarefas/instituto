import { signOut, auth } from '../0_firebase_api_config.js';

// Carregar tela baseado no ID
export async function carregarTela(telaId, userData) {
    const contentArea = document.getElementById('contentArea');
    
    // Mostrar loading
    contentArea.innerHTML = '<div class="text-center"><div class="loading-spinner"></div><p class="mt-2">Carregando...</p></div>';
    
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
        } else {
            throw new Error('Função renderizar não encontrada');
        }
    } catch (error) {
        console.error('Erro ao carregar tela:', error);
        contentArea.innerHTML = `
            <div class="alert alert-danger">
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
        return JSON.parse(sessionData);
    }
    return null;
}

// Logout
export async function logout() {
    try {
        localStorage.removeItem('userSession');
        if (auth && signOut) {
            await signOut(auth);
        }
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

// Mostrar notificação
export function mostrarNotificacao(mensagem, tipo = 'success') {
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert alert-${tipo} alert-dismissible fade show position-fixed top-0 end-0 m-3`;
    alertDiv.style.zIndex = '9999';
    alertDiv.innerHTML = `
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