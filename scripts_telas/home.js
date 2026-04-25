export async function renderizar(container, userData) {
    container.innerHTML = `
        <div class="row">
            <div class="col-12">
                <div class="card shadow">
                    <div class="card-body">
                        <div class="text-center mb-4">
                            <i class="fas fa-home fa-3x text-primary"></i>
                        </div>
                        <h1 class="card-title text-center mb-4">Bem-vindo, ${userData?.nome || 'Usuário'}!</h1>
                        <p class="card-text lead text-center">Esta é a área principal do sistema.</p>
                        <hr>
                        <div class="row mt-4">
                            <div class="col-md-6 mx-auto">
                                <div class="alert alert-info">
                                    <i class="fas fa-info-circle me-2"></i>
                                    <strong>Informações do Usuário:</strong>
                                    <ul class="mt-2 mb-0">
                                        <li><strong>Login:</strong> ${userData?.login || 'N/A'}</li>
                                        <li><strong>Nome:</strong> ${userData?.nome || 'N/A'}</li>
                                        <li><strong>Cargo:</strong> ${userData?.cargo || 'N/A'}</li>
                                        <li><strong>Perfil:</strong> ${userData?.perfil || 'N/A'}</li>
                                        <li><strong>Email:</strong> ${userData?.email || 'N/A'}</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
}
