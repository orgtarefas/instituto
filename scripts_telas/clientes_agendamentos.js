export async function renderizar(container, userData) {
    container.innerHTML = `
        <div class="row">
            <div class="col-12">
                <div class="card shadow-lg border-0 rounded-4">
                    <div class="card-body text-center py-5">
                        <i class="fas fa-calendar-alt fa-5x text-primary mb-4"></i>
                        <h2 class="mb-3">Meus Agendamentos</h2>
                        <p class="lead text-muted mb-4">Área do Cliente</p>
                        <div class="alert alert-warning border-0 rounded-3">
                            <i class="fas fa-tools me-2"></i>
                            <strong>Em Desenvolvimento</strong>
                            <p class="mb-0 mt-2">Esta funcionalidade estará disponível em breve!</p>
                        </div>
                        <div class="progress mt-4 mx-auto" style="height: 8px; max-width: 300px;">
                            <div class="progress-bar progress-bar-striped progress-bar-animated bg-primary" 
                                 style="width: 25%"></div>
                        </div>
                        <p class="text-muted mt-2 small">Progresso: 25%</p>
                    </div>
                </div>
            </div>
        </div>
    `;
}
