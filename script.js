// Estado global
let membros = [];
let editandoId = null;

// Elementos DOM
const formCadastro = document.getElementById('formCadastro');
const tabButtons = document.querySelectorAll('.tab-btn');
const tabPanels = document.querySelectorAll('.tab-panel');

// Inicialização
document.addEventListener('DOMContentLoaded', function() {
    carregarMembros();
    configurarEventos();
});

// Configurar eventos
function configurarEventos() {
    // Tabs
    tabButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const target = btn.dataset.tab;
            mostrarTab(target);
        });
    });

    // Formulário de cadastro
    formCadastro.addEventListener('submit', function(e) {
        e.preventDefault();
        if (editandoId) {
            atualizarMembro();
        } else {
            cadastrarMembro();
        }
    });
}

// Carregar membros do servidor
async function carregarMembros() {
    try {
        const response = await fetch('/api/membros');
        if (response.ok) {
            membros = await response.json();
            atualizarListagemEDashboard();
        }
    } catch (error) {
        console.error('Erro ao carregar membros:', error);
    }
}

// Coletar dados do formulário
function coletarDadosFormulario() {
    return {
        nome: document.getElementById('nome').value,
        dataNascimento: document.getElementById('dataNascimento').value,
        telefone: document.getElementById('telefone').value,
        email: document.getElementById('email').value,
        estadoCivil: document.getElementById('estadoCivil').value,
        escolaridade: document.getElementById('escolaridade').value,
        profissao: document.getElementById('profissao').value,
        nomeConjuge: document.getElementById('nomeConjuge').value,
        dataCasamento: document.getElementById('dataCasamento').value,
        endereco: document.getElementById('endereco').value,
        complemento: document.getElementById('complemento').value,
        cep: document.getElementById('cep').value,
        bairro: document.getElementById('bairro').value,
        cidadeUf: document.getElementById('cidadeUf').value,
        anoAceitou: document.getElementById('anoAceitou').value,
        qtdFilhos: parseInt(document.getElementById('qtdFilhos').value) || 0,
        idadeFilhos: document.getElementById('idadeFilhos').value,
        filhosCongregam: document.getElementById('filhosCongregam').value,
        temFamiliaresIgreja: document.getElementById('temFamiliaresIgreja').value,
        familiarNome1: document.getElementById('familiarNome1').value,
        familiarParentesco1: document.getElementById('familiarParentesco1').value,
        familiarNome2: document.getElementById('familiarNome2').value,
        familiarParentesco2: document.getElementById('familiarParentesco2').value,
        familiarNome3: document.getElementById('familiarNome3').value,
        familiarParentesco3: document.getElementById('familiarParentesco3').value,
        conheceAlguemIgreja: document.getElementById('conheceAlguemIgreja').value,
        conhecidoNome1: document.getElementById('conhecidoNome1').value,
        conhecidoNome2: document.getElementById('conhecidoNome2').value,
        conhecidoNome3: document.getElementById('conhecidoNome3').value,
        ehBatizado: document.getElementById('ehBatizado').value,
        dataBatismo: document.getElementById('dataBatismo').value,
        formaBatismo: document.getElementById('formaBatismo').value,
        igrejaBatismo: document.getElementById('igrejaBatismo').value,
        ehEvangelico: document.getElementById('ehEvangelico').value,
        congregaOutraIgreja: document.getElementById('congregaOutraIgreja').value,
        qualIgreja: document.getElementById('qualIgreja').value,
        observacoes: document.getElementById('observacoes').value
    };
}

// Preencher formulário com dados
function preencherFormulario(membro) {
    document.getElementById('nome').value = membro.nome || '';
    document.getElementById('dataNascimento').value = membro.dataNascimento || '';
    document.getElementById('telefone').value = membro.telefone || '';
    document.getElementById('email').value = membro.email || '';
    document.getElementById('estadoCivil').value = membro.estadoCivil || '';
    document.getElementById('escolaridade').value = membro.escolaridade || '';
    document.getElementById('profissao').value = membro.profissao || '';
    document.getElementById('nomeConjuge').value = membro.nomeConjuge || '';
    document.getElementById('dataCasamento').value = membro.dataCasamento || '';
    document.getElementById('endereco').value = membro.endereco || '';
    document.getElementById('complemento').value = membro.complemento || '';
    document.getElementById('cep').value = membro.cep || '';
    document.getElementById('bairro').value = membro.bairro || '';
    document.getElementById('cidadeUf').value = membro.cidadeUf || '';
    document.getElementById('anoAceitou').value = membro.anoAceitou || '';
    document.getElementById('qtdFilhos').value = membro.qtdFilhos || 0;
    document.getElementById('idadeFilhos').value = membro.idadeFilhos || '';
    document.getElementById('filhosCongregam').value = membro.filhosCongregam || '';
    document.getElementById('temFamiliaresIgreja').value = membro.temFamiliaresIgreja || '';
    document.getElementById('familiarNome1').value = membro.familiarNome1 || '';
    document.getElementById('familiarParentesco1').value = membro.familiarParentesco1 || '';
    document.getElementById('familiarNome2').value = membro.familiarNome2 || '';
    document.getElementById('familiarParentesco2').value = membro.familiarParentesco2 || '';
    document.getElementById('familiarNome3').value = membro.familiarNome3 || '';
    document.getElementById('familiarParentesco3').value = membro.familiarParentesco3 || '';
    document.getElementById('conheceAlguemIgreja').value = membro.conheceAlguemIgreja || '';
    document.getElementById('conhecidoNome1').value = membro.conhecidoNome1 || '';
    document.getElementById('conhecidoNome2').value = membro.conhecidoNome2 || '';
    document.getElementById('conhecidoNome3').value = membro.conhecidoNome3 || '';
    document.getElementById('ehBatizado').value = membro.ehBatizado || '';
    document.getElementById('dataBatismo').value = membro.dataBatismo || '';
    document.getElementById('formaBatismo').value = membro.formaBatismo || '';
    document.getElementById('igrejaBatismo').value = membro.igrejaBatismo || '';
    document.getElementById('ehEvangelico').value = membro.ehEvangelico || '';
    document.getElementById('congregaOutraIgreja').value = membro.congregaOutraIgreja || '';
    document.getElementById('qualIgreja').value = membro.qualIgreja || '';
    document.getElementById('observacoes').value = membro.observacoes || '';
}

// Cadastrar novo membro
async function cadastrarMembro() {
    try {
        const dados = coletarDadosFormulario();
        
        const response = await fetch('/api/membros', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(dados)
        });

        if (response.ok) {
            formCadastro.reset();
            alert('Membro cadastrado com sucesso!');
            await carregarMembros(); // Recarregar dados
        } else {
            const error = await response.json();
            alert('Erro ao cadastrar: ' + error.error);
        }
    } catch (error) {
        console.error('Erro ao cadastrar membro:', error);
        alert('Erro ao cadastrar membro');
    }
}

// Atualizar membro existente
async function atualizarMembro() {
    try {
        const dados = coletarDadosFormulario();
        
        const response = await fetch(`/api/membros/${editandoId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(dados)
        });

        if (response.ok) {
            formCadastro.reset();
            editandoId = null;
            document.querySelector('.btn.primary').textContent = 'Cadastrar';
            alert('Membro atualizado com sucesso!');
            await carregarMembros(); // Recarregar dados
            mostrarTab('lista');
        } else {
            const error = await response.json();
            alert('Erro ao atualizar: ' + error.error);
        }
    } catch (error) {
        console.error('Erro ao atualizar membro:', error);
        alert('Erro ao atualizar membro');
    }
}

// Excluir membro
async function excluirMembro(id) {
    if (!confirm('Tem certeza que deseja excluir este membro?')) {
        return;
    }

    try {
        const response = await fetch(`/api/membros/${id}`, {
            method: 'DELETE'
        });

        if (response.ok) {
            alert('Membro excluído com sucesso!');
            await carregarMembros(); // Recarregar dados
        } else {
            const error = await response.json();
            alert('Erro ao excluir: ' + error.error);
        }
    } catch (error) {
        console.error('Erro ao excluir membro:', error);
        alert('Erro ao excluir membro');
    }
}

// Editar membro
function editarMembro(id) {
    const membro = membros.find(m => m.id === id);
    if (membro) {
        editandoId = id;
        preencherFormulario(membro);
        document.querySelector('.btn.primary').textContent = 'Atualizar';
        mostrarTab('cadastro');
    }
}

// Mostrar tab
function mostrarTab(tabName) {
    // Atualizar botões
    tabButtons.forEach(btn => {
        btn.classList.toggle('active', btn.dataset.tab === tabName);
    });

    // Atualizar painéis
    tabPanels.forEach(panel => {
        panel.classList.toggle('show', panel.id === `tab-${tabName}`);
    });

    // Atualizar conteúdo específico da tab
    if (tabName === 'lista') {
        atualizarListagem();
    } else if (tabName === 'dashboard') {
        atualizarDashboard();
    }
}

// Atualizar listagem e dashboard
function atualizarListagemEDashboard() {
    atualizarListagem();
    atualizarDashboard();
}

// Atualizar listagem
function atualizarListagem() {
    const tbody = document.getElementById('membros-tbody');
    
    if (membros.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="19" style="text-align: center; padding: 2rem;">
                    <h3>Nenhum membro cadastrado</h3>
                    <p>Clique em "Cadastro" para adicionar o primeiro membro.</p>
                </td>
            </tr>
        `;
        return;
    }

    tbody.innerHTML = membros.map(membro => `
        <tr>
            <td>${membro.nome || '-'}</td>
            <td>${membro.dataNascimento || '-'}</td>
            <td>${membro.telefone || '-'}</td>
            <td>${membro.email || '-'}</td>
            <td>${membro.estadoCivil || '-'}</td>
            <td>${membro.escolaridade || '-'}</td>
            <td>${membro.profissao || '-'}</td>
            <td>${membro.endereco || '-'}</td>
            <td>${membro.bairro || '-'}</td>
            <td>${membro.cidadeUf || '-'}</td>
            <td>${membro.anoAceitou || '-'}</td>
            <td>${membro.qtdFilhos || 0}</td>
            <td>${membro.idadeFilhos || '-'}</td>
            <td>${membro.filhosCongregam || '-'}</td>
            <td>${membro.ehBatizado || '-'}</td>
            <td>${membro.dataBatismo || '-'}</td>
            <td>${membro.ehEvangelico || '-'}</td>
            <td>${membro.observacoes || '-'}</td>
            <td class="actions">
                <button class="btn small primary" onclick="editarMembro('${membro.id}')">Editar</button>
                <button class="btn small danger" onclick="excluirMembro('${membro.id}')">Excluir</button>
            </td>
        </tr>
    `).join('');
}

// Atualizar dashboard
async function atualizarDashboard() {
    try {
        // Buscar estatísticas do servidor
        const response = await fetch('/api/membros/stats');
        if (response.ok) {
            const stats = await response.json();
            
            // Atualizar cards de estatísticas
            document.getElementById('total-membros').textContent = stats.totalMembros;
            document.getElementById('total-filhos').textContent = stats.totalFilhos;
            document.getElementById('total-batizados').textContent = stats.batizados;
            document.getElementById('total-evangelicos').textContent = stats.evangelicos;
            
            // Atualizar gráficos
            atualizarGraficos(stats);
        }
    } catch (error) {
        console.error('Erro ao carregar estatísticas:', error);
    }
}

// Atualizar gráficos
function atualizarGraficos(stats) {
    // Gráfico de Estado Civil
    const estadoCivilCtx = document.getElementById('estadoCivilChart');
    if (estadoCivilCtx) {
        new Chart(estadoCivilCtx, {
            type: 'pie',
            data: {
                labels: ['Casados', 'Solteiros', 'Outros'],
                datasets: [{
                    data: [stats.casados, stats.solteiros, stats.totalMembros - stats.casados - stats.solteiros],
                    backgroundColor: ['#4f5dff', '#7c4dff', '#e5e7eb']
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        position: 'bottom'
                    }
                }
            }
        });
    }

    // Gráfico de Batismo
    const batismoCtx = document.getElementById('batismoChart');
    if (batismoCtx) {
        new Chart(batismoCtx, {
            type: 'doughnut',
            data: {
                labels: ['Batizados', 'Não Batizados'],
                datasets: [{
                    data: [stats.batizados, stats.totalMembros - stats.batizados],
                    backgroundColor: ['#4f5dff', '#e5e7eb']
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        position: 'bottom'
                    }
                }
            }
        });
    }
}

// Filtrar membros
function filtrarMembros() {
    const busca = document.getElementById('busca').value.toLowerCase();
    const tbody = document.getElementById('membros-tbody');
    const rows = tbody.getElementsByTagName('tr');

    for (let i = 0; i < rows.length; i++) {
        const row = rows[i];
        const nome = row.cells[0]?.textContent.toLowerCase() || '';
        const telefone = row.cells[2]?.textContent.toLowerCase() || '';
        
        if (nome.includes(busca) || telefone.includes(busca)) {
            row.style.display = '';
        } else {
            row.style.display = 'none';
        }
    }
}

// Exportar CSV
function exportarCSV() {
    if (membros.length === 0) {
        alert('Não há dados para exportar');
        return;
    }

    const headers = [
        'Nome', 'Data Nascimento', 'Telefone', 'Email', 'Estado Civil', 
        'Escolaridade', 'Profissão', 'Endereço', 'Bairro', 'Cidade/UF',
        'Ano Aceitou', 'Qtd Filhos', 'Idade Filhos', 'Filhos Congregam',
        'É Batizado', 'Data Batismo', 'É Evangélico', 'Observações'
    ];

    const csvContent = [
        headers.join(','),
        ...membros.map(membro => [
            `"${membro.nome || ''}"`,
            `"${membro.dataNascimento || ''}"`,
            `"${membro.telefone || ''}"`,
            `"${membro.email || ''}"`,
            `"${membro.estadoCivil || ''}"`,
            `"${membro.escolaridade || ''}"`,
            `"${membro.profissao || ''}"`,
            `"${membro.endereco || ''}"`,
            `"${membro.bairro || ''}"`,
            `"${membro.cidadeUf || ''}"`,
            `"${membro.anoAceitou || ''}"`,
            `"${membro.qtdFilhos || 0}"`,
            `"${membro.idadeFilhos || ''}"`,
            `"${membro.filhosCongregam || ''}"`,
            `"${membro.ehBatizado || ''}"`,
            `"${membro.dataBatismo || ''}"`,
            `"${membro.ehEvangelico || ''}"`,
            `"${membro.observacoes || ''}"`
        ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', 'membros_adpaz.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

