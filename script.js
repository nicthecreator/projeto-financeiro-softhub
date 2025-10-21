document.addEventListener("DOMContentLoaded", function () {
    console.log("=== SCRIPT INICIADO ===");
    
    // 1. SELECIONAR OS ELEMENTOS DO HTML
    const campoMensalidade = document.getElementById("valor-mensalidade");
    const campoDesconto = document.getElementById("desconto-unieuro");
    const toggleProuni = document.getElementById("toggle-prouni");
    const botaoCalcular = document.getElementById("btn-calcular");
    const botaoLimpar = document.getElementById("btn-limpar");
    const botaoPdf = document.getElementById("btn-pdf");
    const blocoResultadoProuni = document.getElementById("bloco-resultado-prouni");

    console.log("Elementos encontrados:", {
        campoMensalidade: !!campoMensalidade,
        campoDesconto: !!campoDesconto,
        toggleProuni: !!toggleProuni,
        botaoCalcular: !!botaoCalcular,
        botaoLimpar: !!botaoLimpar,
        botaoPdf: !!botaoPdf,
        blocoResultadoProuni: !!blocoResultadoProuni
    });

    // Elementos de resultado
    const elMensalComDesconto = document.querySelector("#resultado-base .grid div:nth-child(1) .text-4xl");
    const elSemestreComDesconto = document.querySelector("#resultado-base .grid div:nth-child(2) .text-4xl");
    const elMensalSemDesconto = document.querySelector("#resultado-base .grid div:nth-child(3) .text-4xl");
    const elSemestreSemDesconto = document.querySelector("#resultado-base .grid div:nth-child(4) .text-4xl");
    const elProuniMensal = document.querySelector("#bloco-resultado-prouni .grid div:nth-child(1) .text-3xl");
    const elProuniSemestre = document.querySelector("#bloco-resultado-prouni .grid div:nth-child(2) .text-3xl");

    console.log("Elementos de resultado:", {
        elMensalComDesconto: !!elMensalComDesconto,
        elSemestreComDesconto: !!elSemestreComDesconto,
        elMensalSemDesconto: !!elMensalSemDesconto,
        elSemestreSemDesconto: !!elSemestreSemDesconto,
        elProuniMensal: !!elProuniMensal,
        elProuniSemestre: !!elProuniSemestre
    });

    // Função para formatar dinheiro
    function formatarDinheiro(valor) {
        return valor.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
    }

    // Função principal de cálculo
    function calcularEAtualizarTela() {
        console.log("=== INICIANDO CÁLCULO ===");
        
        const mensalidadeBruta = parseFloat(campoMensalidade.value) || 0;
        const descontoUnieuro = parseFloat(campoDesconto.value) || 0;

        console.log("Valores capturados:", {
            mensalidadeBruta,
            descontoUnieuro
        });

        // Validações
        if (mensalidadeBruta === 0 || descontoUnieuro === 0) {
            console.log("Valores inválidos - mostrando alerta");
            alert("Por favor, preencha os valores da mensalidade e do desconto para continuar.");
            return;
        }
        if (descontoUnieuro < 5 || descontoUnieuro > 50) {
            console.log("Desconto fora do range - mostrando alerta");
            alert("O Desconto Unieuro deve ser um valor entre 5% e 50%.");
            return;
        }

        // Cálculos
        const mensalidadeComDesconto = mensalidadeBruta * (1 - descontoUnieuro / 100);
        const semestreBruto = mensalidadeBruta * 6;
        const semestreComDesconto = mensalidadeComDesconto * 6;

        console.log("Resultados calculados:", {
            mensalidadeComDesconto,
            semestreBruto,
            semestreComDesconto
        });

        // Atualizar Tela
        console.log("Atualizando elementos na tela...");
        elMensalSemDesconto.textContent = formatarDinheiro(mensalidadeBruta);
        elSemestreSemDesconto.textContent = formatarDinheiro(semestreBruto);
        elMensalComDesconto.textContent = formatarDinheiro(mensalidadeComDesconto);
        elSemestreComDesconto.textContent = formatarDinheiro(semestreComDesconto);

        console.log("Elementos atualizados:", {
            semDesconto: elMensalSemDesconto.textContent,
            comDesconto: elMensalComDesconto.textContent
        });

        // Lógica do PROUNI
        if (toggleProuni.checked) {
            console.log("PROUNI ativado - calculando...");
            blocoResultadoProuni.classList.remove('hidden');
            const mensalidadeProuni = mensalidadeComDesconto * 0.5;
            const semestreProuni = mensalidadeProuni * 6;
            elProuniMensal.textContent = formatarDinheiro(mensalidadeProuni);
            elProuniSemestre.textContent = formatarDinheiro(semestreProuni);
            console.log("PROUNI calculado:", {
                mensalidadeProuni: elProuniMensal.textContent,
                semestreProuni: elProuniSemestre.textContent
            });
        } else {
            console.log("PROUNI desativado - escondendo bloco");
            blocoResultadoProuni.classList.add('hidden');
        }

        console.log("=== CÁLCULO FINALIZADO ===");
    }

    // Função para limpar
    function limparCampos() {
        console.log("Limpando campos...");
        campoMensalidade.value = "";
        campoDesconto.value = "";
        
        const valorZero = formatarDinheiro(0);
        elMensalSemDesconto.textContent = valorZero;
        elSemestreSemDesconto.textContent = valorZero;
        elMensalComDesconto.textContent = valorZero;
        elSemestreComDesconto.textContent = valorZero;
        elProuniMensal.textContent = valorZero;
        elProuniSemestre.textContent = valorZero;
        
        toggleProuni.checked = false;
        blocoResultadoProuni.classList.add('hidden');
        
        console.log("Campos limpos");
    }

    // FUNÇÃO PDF SIMPLIFICADA
    function gerarPdf() {
        console.log("=== GERANDO PDF ===");
        
        // Primeiro calcula
        calcularEAtualizarTela();
        
        // Pega os valores JÁ CALCULADOS
        const mensalComDesconto = elMensalComDesconto.textContent;
        const semestreComDesconto = elSemestreComDesconto.textContent;
        const mensalSemDesconto = elMensalSemDesconto.textContent;
        const semestreSemDesconto = elSemestreSemDesconto.textContent;

        console.log("Valores para PDF:", {
            mensalComDesconto,
            semestreComDesconto,
            mensalSemDesconto,
            semestreSemDesconto
        });

        let prouniContent = '';
        let resultadoFinalContent = '';
        
        if (toggleProuni.checked) {
            const prouniMensal = elProuniMensal.textContent;
            const prouniSemestre = elProuniSemestre.textContent;
            
            prouniContent = `
                <div style="background: #faf8f5; padding: 20px; margin: 20px 0; border-radius: 8px; border-left: 4px solid #8B7500; border: 1px solid #d0d0d0;">
                    <h4 style="color: #8B7500; margin: 0 0 15px 0; font-size: 16px; font-weight: bold;">DESCONTO PROUNI (50%)</h4>
                    <div style="background: white; padding: 15px; border-radius: 5px; border: 1px solid #d0d0d0;">
                        <div style="display: flex; justify-content: space-between; margin: 10px 0; font-size: 15px;">
                            <strong>Mensalidade com PROUNI:</strong>
                            <strong style="color: #8B7500; font-size: 18px;">${prouniMensal}</strong>
                        </div>
                        <div style="display: flex; justify-content: space-between; margin: 10px 0; font-size: 15px;">
                            <strong>Semestre com PROUNI:</strong>
                            <strong style="color: #8B7500; font-size: 18px;">${prouniSemestre}</strong>
                        </div>
                    </div>
                </div>
            `;
            
            resultadoFinalContent = `
                <div style="background: #0D4B81; padding: 25px; margin: 25px 0; border-radius: 8px; color: white; border: 2px solid #0D4B81;">
                    <h3 style="margin: 0 0 20px 0; text-align: center; font-size: 18px; font-weight: bold;">RESULTADO FINAL - COM TODOS OS DESCONTOS</h3>
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-top: 15px;">
                        <div style="text-align: center;">
                            <div style="font-size: 13px; opacity: 0.9;">MENSALIDADE</div>
                            <div style="font-size: 24px; font-weight: bold; margin: 8px 0;">${prouniMensal}</div>
                        </div>
                        <div style="text-align: center;">
                            <div style="font-size: 13px; opacity: 0.9;">TOTAL DO SEMESTRE</div>
                            <div style="font-size: 24px; font-weight: bold; margin: 8px 0;">${prouniSemestre}</div>
                        </div>
                    </div>
                </div>
            `;
        }
        
    const htmlContent = `
        <html>
            <head><title>Simulação Unieuro</title></head>
            <body style="font-family: Arial; padding: 20px;">
                <div style="text-align: center; margin-bottom: 30px;">
                <img src="imagens/logounieuro.png" alt="Unieuro" style="height: 60px; margin-bottom: 15px;">
                    <h1 style="color: #0D4B81;">SIMULAÇÃO FINANCEIRA</h1>
                    <p>Centro Universitário Unieuro</p>
                 </div>
                
                <div style="margin-bottom: 20px;">
                    <h3>VALORES ORIGINAIS</h3>
                    <p>Mensalidade: ${mensalSemDesconto}</p>
                    <p>Semestre: ${semestreSemDesconto}</p>
                </div>
                
                <div style="margin-bottom: 20px;">
                    <h3>COM DESCONTO UNIEURO</h3>
                    <p>Mensalidade: ${mensalComDesconto}</p>
                    <p>Semestre: ${semestreComDesconto}</p>
                </div>
                
                ${prouniContent}
                ${resultadoFinalContent}
                
                <div style="margin-top: 30px; padding: 15px; background: #f0f0f0;">
                    <p><strong>FIES:</strong> Não calculado automaticamente. Consulte a Central de Atendimento.</p>
                </div>
                
                <div class="no-print" style="text-align: center; margin-top: 20px;">
                    <button onclick="window.print()" style="padding: 10px 20px; background: #0D4B81; color: white; border: none; cursor: pointer;">
                        Imprimir / Salvar PDF
                    </button>
                </div>
            </body>
        </html>`;
        
        const janela = window.open('', '_blank');
        janela.document.write(htmlContent);
        janela.document.close();
        console.log("PDF gerado com sucesso!");
    }

    // Event Listeners
    console.log("Configurando event listeners...");
    
    botaoCalcular.addEventListener('click', function (event) {
        console.log("Botão Calcular clicado");
        event.preventDefault();
        calcularEAtualizarTela();
    });

    botaoLimpar.addEventListener('click', function (event) {
        console.log("Botão Limpar clicado");
        event.preventDefault();
        limparCampos();
    });

    toggleProuni.addEventListener('change', function() {
        console.log("Toggle PROUNI alterado:", this.checked);
        calcularEAtualizarTela();
    });

    botaoPdf.addEventListener('click', function (event) {
        console.log("Botão PDF clicado");
        event.preventDefault();
        gerarPdf();
    });

    // Inicializar
    console.log("Inicializando...");
    limparCampos();
    console.log("=== SCRIPT CARREGADO COMPLETAMENTE ===");
});