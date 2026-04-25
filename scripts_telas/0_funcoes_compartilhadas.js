import { auth, db, doc, getDoc, collection, addDoc, deleteDoc, getDocs, query, where, orderBy, updateDoc } from '../0_firebase_api_config.js';

// ==================== FUNÇÕES DE AUTENTICAÇÃO ====================

// Verificar se está autenticado
export async function isAuthenticated() {
    return new Promise((resolve) => {
        const unsubscribe = auth.onAuthStateChanged((user) => {
            unsubscribe();
            resolve(!!user);
        });
    });
}

// Obter usuário atual
export async function getCurrentUser() {
    return new Promise((resolve) => {
        const unsubscribe = auth.onAuthStateChanged((user) => {
            unsubscribe();
            resolve(user);
        });
    });
}

// Verificar permissão para gerenciar imagens
export async function verificarPermissaoAdmin(userData) {
    if (!userData) return false;
    
    // Desenvolvedor (admin) tem acesso total
    if (userData.cargo === 'Desenvolvedor' && userData.perfil === 'admin') {
        return true;
    }
    
    // Funcionário com perfil supervisor ou gerente
    if (userData.cargo === 'Funcionário' && (userData.perfil === 'supervisor' || userData.perfil === 'gerente')) {
        return true;
    }
    
    return false;
}

// Buscar chave da API do ImgBB
export async function getImgBBKey() {
    try {
        const configDoc = await getDoc(doc(db, 'config', 'api'));
        if (configDoc.exists()) {
            return configDoc.data().imgbb_key;
        }
        throw new Error('Chave da API ImgBB não configurada no Firebase');
    } catch (error) {
        console.error('Erro ao buscar chave ImgBB:', error);
        throw error;
    }
}

// Upload de imagem para ImgBB
export async function uploadImageToImgBB(file, onProgress) {
    return new Promise(async (resolve, reject) => {
        try {
            // Buscar a chave da API
            const apiKey = await getImgBBKey();
            
            const formData = new FormData();
            formData.append('image', file);
            
            const xhr = new XMLHttpRequest();
            
            xhr.upload.addEventListener('progress', (e) => {
                if (e.lengthComputable && onProgress) {
                    const percent = Math.round((e.loaded / e.total) * 100);
                    onProgress(percent);
                }
            });
            
            xhr.addEventListener('load', () => {
                if (xhr.status === 200) {
                    try {
                        const response = JSON.parse(xhr.responseText);
                        if (response.success) {
                            resolve(response.data.url);
                        } else {
                            reject(new Error('Erro no upload para ImgBB'));
                        }
                    } catch (error) {
                        reject(error);
                    }
                } else {
                    reject(new Error(`Erro HTTP: ${xhr.status}`));
                }
            });
            
            xhr.addEventListener('error', () => {
                reject(new Error('Erro de conexão com ImgBB'));
            });
            
            xhr.open('POST', `https://api.imgbb.com/1/upload?key=${apiKey}`);
            xhr.send(formData);
            
        } catch (error) {
            reject(error);
        }
    });
}

// Salvar imagem do carrossel no Firestore
export async function salvarImagemCarrossel(dados) {
    try {
        const docRef = await addDoc(collection(db, 'carrossel_novidades'), {
            titulo: dados.titulo,
            descricao: dados.descricao,
            imagem_url: dados.imagem_url,
            tipo: dados.tipo,
            ordem: dados.ordem || Date.now(),
            ativo: true,
            criado_em: new Date().toISOString(),
            criado_por: dados.criado_por
        });
        return docRef.id;
    } catch (error) {
        console.error('Erro ao salvar imagem:', error);
        throw error;
    }
}

// Buscar imagens do carrossel de novidades
export async function buscarImagensNovidades() {
    try {
        const q = query(
            collection(db, 'carrossel_novidades'), 
            where('ativo', '==', true), 
            orderBy('ordem')
        );
        const querySnapshot = await getDocs(q);
        const imagens = [];
        querySnapshot.forEach((doc) => {
            imagens.push({ id: doc.id, ...doc.data() });
        });
        return imagens;
    } catch (error) {
        console.error('Erro ao buscar imagens:', error);
        return [];
    }
}

// Excluir imagem do carrossel
export async function excluirImagemCarrossel(id) {
    try {
        await deleteDoc(doc(db, 'carrossel_novidades', id));
        return true;
    } catch (error) {
        console.error('Erro ao excluir imagem:', error);
        throw error;
    }
}

// ==================== FUNÇÕES DE BACKGROUND ====================

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
            contentWrapper.style.backgroundColor = 'rgba(255, 255, 255, 0.85)';
            contentWrapper.style.borderRadius = '10px';
            contentWrapper.style.margin = '20px';
            contentWrapper.style.padding = '20px';
            contentWrapper.style.minHeight = 'calc(100vh - 100px)';
        }
    }
}

// ==================== FUNÇÕES DE MENU ====================

// Carregar menu baseado no cargo
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

// ==================== FUNÇÕES DE TELA ====================

// Carregar tela
export async function carregarTela(telaId, userData) {
    const contentArea = document.getElementById('contentArea');
    if (!contentArea) return;
    
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

// ==================== FUNÇÕES GERAIS ====================

// Mostrar notificação
export function mostrarNotificacao(mensagem, tipo = 'success') {
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert alert-${tipo} alert-dismissible fade show position-fixed top-0 end-0 m-3`;
    alertDiv.style.zIndex = '9999';
    alertDiv.style.minWidth = '300px';
    alertDiv.style.animation = 'slideIn 0.3s ease';
    alertDiv.innerHTML = `
        <i class="fas ${tipo === 'success' ? 'fa-check-circle' : tipo === 'danger' ? 'fa-exclamation-circle' : 'fa-info-circle'} me-2"></i>
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

// Verificar se é mobile
export function isMobile() {
    return window.innerWidth <= 768;
}
