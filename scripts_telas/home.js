export async function renderizar(container, userData) {
    container.innerHTML = `
        <div class="row">
            <div class="col-12">
                <div class="card">
                    <div class="card-body">
                        <h1 class="card-title">Bem-vindo, ${userData?.nome || 'Usuário'}!</h1>
                        <p class="card-text">Esta é a tela inicial do sistema.</p>
                        <hr>
                        <h5>Informações do Usuário:</h5>
                        <ul class="list-unstyled">
                            <li><strong>Login:</strong> ${userData?.login || 'N/A'}</li>
                            <li><strong>Cargo:</strong> ${userData?.cargo || 'N/A'}</li>
                            <li><strong>Perfil:</strong> ${userData?.perfil || 'N/A'}</li>
                            <li><strong>Email:</strong> ${userData?.email || 'N/A'}</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    `;
}