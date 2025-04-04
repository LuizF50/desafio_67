// Aguarda o DOM carregar completamente
document.addEventListener('DOMContentLoaded', function() {
    // Gera os spots de animação para o botão
    gerarSpotsParaAnimacao();
    
    // Referências aos elementos do DOM
    const buttonCheckbox = document.getElementById('button');
    const resetButton = document.getElementById('reset-button');
    const resultSection = document.querySelector('.result');
    const resultDisplay = document.getElementById('result-display');
    const sequenceInput = document.getElementById('sequence');
    const inputInfo = document.createElement('small'); // Elemento para a mensagem informativa
    
    // Configura a mensagem informativa
    inputInfo.textContent = 'Apenas números separados por vírgula (ex: 12,34,56)';
    inputInfo.style.display = 'block';
    inputInfo.style.marginTop = '5px';
    inputInfo.style.color = '#999';
    sequenceInput.insertAdjacentElement('afterend', inputInfo);
    
    // Inicialmente esconde o botão de reset
    resetButton.style.display = 'none';
    
    // Adiciona o evento de click ao botão principal
    buttonCheckbox.addEventListener('change', function() {
        if (this.checked) {
            // Quando o botão é clicado, processa a sequência
            setTimeout(() => {
                processarSequencia();
                
                // Mostra o resultado após um breve delay para a animação funcionar
                setTimeout(() => {
                    resultSection.classList.add('show');
                    resetButton.style.display = 'inline-block';
                    resetButton.classList.add('show');
                }, 5000);
            }, 500);
        }
    });
    
    // Evento para o botão de reset
    resetButton.addEventListener('click', function(e) {
        e.preventDefault();
        resetarFormulario();
    });
    
    /**
     * Gera dinamicamente os elementos de spots para a animação do botão
     */
    function gerarSpotsParaAnimacao() {
        const quadDiv = document.querySelector('.b_l_quad');
        // Cria 52 elementos de spots, conforme o SCSS espera
        for (let i = 1; i <= 52; i++) {
            const spot = document.createElement('div');
            spot.className = 'button_spots';
            quadDiv.appendChild(spot);
        }
    }
    
    /**
     * Processa a sequência de entrada do usuário e exibe o resultado
     */
    function processarSequencia() {
        // Obtém a sequência do input e remove espaços em branco
        const input = sequenceInput.value.trim();
        
        // Verifica se o input está vazio
        if (!input) {
            resultDisplay.textContent = 'Por favor, insira uma sequência válida.';
            return;
        }
        
        // Divide a string por vírgulas e remove espaços extras
        let numeros = input.split(',').map(num => num.trim());
        
        // Limpa quaisquer colchetes, aspas, etc que o usuário possa ter incluído
        numeros = numeros.map(num => num.replace(/[\[\]"']/g, ''));
        
        // Verifica se há algum item não numérico
        const containsNonNumbers = numeros.some(num => !/^\d+$/.test(num));
        
        if (containsNonNumbers) {
            resultDisplay.textContent = 'A sequência deve conter apenas números separados por vírgula.';
            return;
        }
        
        // Chama a função que resolve o enigma
        const resultado = resolverEnigmaDoMago(numeros);
        
        // Exibe o resultado formatado
        resultDisplay.textContent = `[${resultado.join(', ')}]`;
    }
    
    /**
     * Função principal que resolve o enigma do Mago do Tempo
     * @param {Array} numeros - Array de strings representando os números desordenados
     * @return {Array} - Array de strings com a sequência correta
     */
    function resolverEnigmaDoMago(numeros) {
        // Verifica se há números para processar
        if (!numeros || numeros.length === 0) {
            return [];
        }
        
        // Mapa para armazenar os pares (número, número invertido)
        const paresDeNumeros = [];
        const numerosProcessados = new Set();
        
        // Identifica e agrupa os pares de números
        for (let i = 0; i < numeros.length; i++) {
            const num = numeros[i];
            
            // Pula se o número já foi processado
            if (numerosProcessados.has(num)) {
                continue;
            }
            
            // Inverte o número
            const numeroInvertido = num.split('').reverse().join('');
            
            // Verifica se o inverso está na lista
            const indexInverso = numeros.indexOf(numeroInvertido);
            
            if (indexInverso !== -1 && !numerosProcessados.has(numeroInvertido)) {
                // Decide qual número vem primeiro com base na ordenação numérica
                const menorNumero = parseInt(num) <= parseInt(numeroInvertido) ? num : numeroInvertido;
                const maiorNumero = parseInt(num) > parseInt(numeroInvertido) ? num : numeroInvertido;
                
                // Adiciona o par ordenado
                paresDeNumeros.push([menorNumero, maiorNumero]);
                
                // Marca ambos como processados
                numerosProcessados.add(num);
                numerosProcessados.add(numeroInvertido);
            } else {
                // Se não encontrar o par, adiciona o número sozinho
                paresDeNumeros.push([num]);
                numerosProcessados.add(num);
            }
        }
        
        // Ordena os pares baseado no primeiro número de cada par
        paresDeNumeros.sort((a, b) => parseInt(a[0]) - parseInt(b[0]));
        
        // Achata o array de pares para a sequência final
        return paresDeNumeros.flat();
    }
    
    /**
     * Reseta o formulário para um novo teste
     */
    function resetarFormulario() {
        // Desmarca o checkbox do botão
        buttonCheckbox.checked = false;
        
        // Esconde o resultado e o botão de reset
        resultSection.classList.remove('show');
        resetButton.classList.remove('show');
        
        // Limpa o campo de entrada
        sequenceInput.value = '';
        
        // Após um breve delay, esconde completamente o botão de reset
        setTimeout(() => {
            resetButton.style.display = 'none';
        }, 500);
    }
});