document.getElementById('calculadora-form').addEventListener('submit', function(event) {
    
    
    event.preventDefault(); 
    
    
    const horas = parseFloat(document.getElementById('horas').value) || 0;
    const minutos = parseFloat(document.getElementById('minutos').value) || 0;
    const valorUber = parseFloat(document.getElementById('uber').value) || 0;
    const valorComida = parseFloat(document.getElementById('comida').value) || 0;
    const valorOutros = parseFloat(document.getElementById('outros').value) || 0;


    
    const valorPorHora = 30;
    const totalHorasDecimais = horas + (minutos / 60);
    const valorHoras = totalHorasDecimais * valorPorHora;


    
    const valorCustosAdicionais = valorUber + valorComida + valorOutros;
    const valorTotal = valorHoras + valorCustosAdicionais;



    const formatarMoeda = (valor) => {
        return valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    };

    const divResultado = document.getElementById('resultado');
    
    
    divResultado.innerHTML = `
        <p class="ganhos">
            Valor (Horas): 
            <span>${formatarMoeda(valorHoras)}</span>
        </p>
        <p class="custos-adicionais">
            Custos Adicionais: 
            <span>+ ${formatarMoeda(valorCustosAdicionais)}</span>
        </p>
        <h2>
            Valor TOTAL:
            <span>${formatarMoeda(valorTotal)}</span>
        </h2>
    `;
});