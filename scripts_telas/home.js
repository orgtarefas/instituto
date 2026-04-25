export async function renderizar(container, userData) {
    container.innerHTML = `
        <div class="row">
            <div class="col-12">
                <div class="card shadow-lg border-0 rounded-4">
                    <div class="card-body p-5">
                        <div class="text-center mb-4">
                            <i class="fas fa-home fa-4x text-primary"></i>
                        </div>
                        <h1 class="card-title text-center mb-3">Bem-vindo, ${userData?.nome || 'Usuário'}!</h1>
                        <p class="card-text lead text-center text-muted mb-4">Esta é a área principal do sistema.</p>
                        <hr class="my-4">
                        <div class="row mt-4">
                            <div class="col-md-8 mx-auto">
                                <div class="alert alert-info border-0 rounded-3">
                                    <i class="fas fa-info-circle me-2"></i>
                                    <strong>Informações do Usuário:</strong>
                                    <ul class="mt-3 mb-0 list-unstyled">
                                        <li class="mb-2"><i class="fas fa-user me-2"></i> <strong>Login:</strong> ${userData?.login || 'N/A'}</li>
                                        <li class="mb-2"><i class="fas fa-id-card me-2"></i> <strong>Nome:</strong> ${userData?.nome || 'N/A'}</li>
                                        <li class="mb-2"><i class="fas fa-briefcase me-2"></i> <strong>Cargo:</strong> ${userData?.cargo || 'N/A'}</li>
                                        <li class="mb-2"><i class="fas fa-shield-alt me-2"></i> <strong>Perfil:</strong> ${userData?.perfil || 'N/A'}</li>
                                        <li class="mb-2"><i class="fas fa-envelope me-2"></i> <strong>Email:</strong> ${userData?.email || 'N/A'}</li>
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
