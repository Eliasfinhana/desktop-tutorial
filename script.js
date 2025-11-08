const dias = [
    { id: 'seg', nome: 'Segunda-feira' },
    { id: 'ter', nome: 'Terça-feira' },
    { id: 'qua', nome: 'Quarta-feira' },
    { id: 'qui', nome: 'Quinta-feira' },
    { id: 'sex', nome: 'Sexta-feira' },
    { id: 'sab', nome: 'Sábado' },
    { id: 'dom', nome: 'Domingo' }
];
const valorPorHora = 30;
const storageKey = 'controleSemanalDados';

function formatarMoeda(valor) {
    return valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

function formatarDuracao(totalMinutos) {
    // totalMinutos: integer
    const horas = Math.floor(totalMinutos / 60);
    const minutos = totalMinutos % 60;
    if (horas > 0 && minutos > 0) return `${horas}h ${minutos}m`;
    if (horas > 0) return `${horas}h`;
    return `${minutos}m`;
}

document.addEventListener('DOMContentLoaded', function() {
    
    const form = document.getElementById('calculadora-form');
    const divResultado = document.getElementById('resultado');

    const dadosSalvos = localStorage.getItem(storageKey);
    if (dadosSalvos) {
        const dados = JSON.parse(dadosSalvos);
        for (const dia of dias) {
            if (dados[dia.id]) {
                document.getElementById(`entrada-${dia.id}`).value = dados[dia.id].entrada || '';
                document.getElementById(`saida-${dia.id}`).value = dados[dia.id].saida || '';
                document.getElementById(`uber-${dia.id}`).value = dados[dia.id].uber || '';
                document.getElementById(`comida-${dia.id}`).value = dados[dia.id].comida || '';
                document.getElementById(`outros-${dia.id}`).value = dados[dia.id].outros || '';
            }
        }
    }

    function rodarCalculo() {
        let grandTotalHoras = 0;
        let grandTotalCustos = 0;
        let grandTotalGeral = 0;
        let grandTotalMinutos = 0; // acumula minutos trabalhados da semana
        let htmlResultado = "";
        
        for (const dia of dias) {
            const entradaStr = document.getElementById(`entrada-${dia.id}`).value;
            const saidaStr = document.getElementById(`saida-${dia.id}`).value;
            
            let valorHoras = 0;
            let minutosTrabalhados = 0; // minutos deste dia
            
            if (entradaStr && saidaStr) {
                const dataEntrada = new Date(`2000-01-01T${entradaStr}`);
                const dataSaida = new Date(`2000-01-01T${saidaStr}`);
                const diffMilissegundos = dataSaida - dataEntrada;
                
                if (diffMilissegundos > 0) {
                    const totalHorasDecimais = diffMilissegundos / 3600000;
                    valorHoras = totalHorasDecimais * valorPorHora;
                    minutosTrabalhados = Math.round(diffMilissegundos / 60000);
                    grandTotalMinutos += minutosTrabalhados;
                }
            }
            
            const uber = parseFloat(document.getElementById(`uber-${dia.id}`).value) || 0;
            const comida = parseFloat(document.getElementById(`comida-${dia.id}`).value) || 0;
            const outros = parseFloat(document.getElementById(`outros-${dia.id}`).value) || 0;
            
            const valorCustos = uber + comida + outros;
            const valorTotalDia = valorHoras + valorCustos;

            grandTotalHoras += valorHoras;
            grandTotalCustos += valorCustos;
            grandTotalGeral += valorTotalDia;

            if (valorTotalDia > 0) {
                htmlResultado += `
                    <div class="resultado-dia">
                        <h3>${dia.nome}</h3>
                        <p>Valor (Horas): <span class="span-ganhos">${formatarMoeda(valorHoras)} ${minutosTrabalhados > 0 ? `(<span class="duracao-dia">${formatarDuracao(minutosTrabalhados)}</span>)` : ''}</span></p>
                        <p>Custos Adicionais: <span class="span-custos">+ ${formatarMoeda(valorCustos)}</span></p>
                        <p><strong>Total do Dia:</strong> <span class="span-total-dia">${formatarMoeda(valorTotalDia)}</span></p>
                    </div>
                `;
            }
        } 

        if (grandTotalGeral === 0) {
             divResultado.innerHTML = "<p>Nenhum valor inserido.</p>";
             return; 
        }
        
        htmlResultado += `
            <div class="resultado-semana">
                <h2>Total da Semana</h2>
                <p>Total Ganhos (Horas): <span class="span-ganhos">${formatarMoeda(grandTotalHoras)} <span class="duracao-semana">(${formatarDuracao(grandTotalMinutos)})</span></span></p>
                <p>Total Custos: <span class="span-custos">+ ${formatarMoeda(grandTotalCustos)}</span></p>
                <p class="total-final">VALOR TOTAL: <span>${formatarMoeda(grandTotalGeral)}</span></p>
            </div>
        `;
        
        divResultado.innerHTML = htmlResultado;
    }

    rodarCalculo();

    form.addEventListener('submit', function(event) {
        event.preventDefault(); 
        rodarCalculo(); 
    });
    
    form.addEventListener('input', function() {
        const dadosParaSalvar = {};
    
        for (const dia of dias) {
            dadosParaSalvar[dia.id] = {
                entrada: document.getElementById(`entrada-${dia.id}`).value,
                saida: document.getElementById(`saida-${dia.id}`).value,
                uber: document.getElementById(`uber-${dia.id}`).value,
                comida: document.getElementById(`comida-${dia.id}`).value,
                outros: document.getElementById(`outros-${dia.id}`).value
            };
        }
        
        localStorage.setItem(storageKey, JSON.stringify(dadosParaSalvar));
    });
    
    document.getElementById('btnLimpar').addEventListener('click', function() {
        
        if (confirm("Tem certeza que deseja limpar todos os dados da semana?")) {
            localStorage.removeItem(storageKey); 
            form.reset(); 
            rodarCalculo(); 
        }
    });
    
});