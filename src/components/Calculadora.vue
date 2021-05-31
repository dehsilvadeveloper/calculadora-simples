<template>

	<!-- INICIO DIV CONTAINER -->
	<div class="container">

		<!-- INICIO ROW -->
		<div class="row">
			
			<!-- INICIO COL -->
			<div class="col-md-6 offset-md-3">

				<!-- INICIO DIV CALCULADORA -->
				<div class="calculadora shadow">

					<!-- LINHA DO DISPLAY -->
					<div class="row">

						<div class="col bg-danger mensagem-erro">
							{{msgErro || ''}}
						</div>

					</div>

					<!-- LINHA DO DISPLAY -->
					<div class="row">

						<div class="col display">
							<div class="operacao-executada">{{calculoQueFoiFeito}}</div>
							<div class="valor-atual">{{atual || '0'}}<span class="cursor">|</span></div>
						</div>

					</div>

					<!-- LINHA DE BOTÕES -->
					<div class="row">

						<div class="col noselect botao" @click="adicionarCaracter(7)">7</div>
						<div class="col noselect botao" @click="adicionarCaracter(8)">8</div>
						<div class="col noselect botao" @click="adicionarCaracter(9)">9</div>
						<div class="col noselect botao operador" @click="adicionarOperacao('divisao')"><font-awesome-icon :icon="['fas', 'divide']" size="xs" /></div>
						<div class="col noselect botao controlador" @click="limpar">C</div>
						
					</div>

					<!-- LINHA DE BOTÕES -->
					<div class="row">

						<div class="col noselect botao" @click="adicionarCaracter(4)">4</div>
						<div class="col noselect botao" @click="adicionarCaracter(5)">5</div>
						<div class="col noselect botao" @click="adicionarCaracter(6)">6</div>
						<div class="col noselect botao operador" @click="adicionarOperacao('multiplicacao')"><font-awesome-icon :icon="['fas', 'times']" size="xs" /></div>
						<div class="col noselect botao apagar" @click="removerCaracter"><font-awesome-icon :icon="['fas', 'backspace']" size="xs" /></div>

					</div>

					<!-- LINHA DE BOTÕES -->
					<div class="row">

						<div class="col noselect botao" @click="adicionarCaracter(1)">1</div>
						<div class="col noselect botao" @click="adicionarCaracter(2)">2</div>
						<div class="col noselect botao" @click="adicionarCaracter(3)">3</div>
						<div class="col noselect botao operador" @click="adicionarOperacao('subtracao')"><font-awesome-icon :icon="['fas', 'minus']" size="xs" /></div>
						<div class="col noselect botao operador" @click="converterEmPorcentagem()"><font-awesome-icon :icon="['fas', 'percentage']" size="xs" /></div>

					</div>

					<!-- LINHA DE BOTÕES -->
					<div class="row">

						<div class="col noselect botao" @click="alternarSinal">+ -</div>
						<div class="col noselect botao" @click="adicionarCaracter(0)">0</div>
						<div class="col noselect botao" @click="adicionarCaracter('.')">.</div>
						<div class="col noselect botao operador" @click="adicionarOperacao('soma')"><font-awesome-icon :icon="['fas', 'plus']"  size="xs"/></div>
						<div class="col noselect botao controlador" @click="calcular"><font-awesome-icon :icon="['fas', 'equals']" size="xs" /></div>

					</div>

				</div>
				<!-- FIM DIV CALCULADORA -->

			</div>
			<!-- FIM COL -->
			
		</div>
		<!-- FIM ROW -->

	</div>
	<!-- FIM DIV CONTAINER -->

</template>

<script>
// Fórmulas de operações disponíveis
const formulas = {
	'divisao': (a, b) => {

		if (b === 0 || isNaN(b)) { 
			throw new Error('Erro: Não é possível dividir por zero'); 
		}

		return a / b;

	},
	'multiplicacao': (a, b) => a * b,
	'subtracao': (a, b) => a - b,
	'soma': (a, b) => a + b,
	'porcentagem': (a, b) => (a / 100) * b
};

// Símbolos de operações disponíveis
const simbolosOperacoes = {
	'divisao': '/',
	'multiplicacao': '*',
	'subtracao': '-',
	'soma': '+',
	'porcentagem': '%'
};

export default {
	name: 'Calculadora',
	data() { // Estado inicial
		return {
			historico: [],
			msgErro: '',
			atual: '',
			anterior: '',
			nomeOperacao: '',
			operacaoAdicionada: false, // controle para saber se alguma operação matemática foi adicionada
			calculo: '', // recebe a formula da operação que será utilizada
			calculoFinalizado: false, // controle para saber se o cálculo já foi finalizado
			calculoQueFoiFeito: '', // texto da ultima operação que foi executada. Ex: 1 + 2
		}
	},
	methods: {

		/*********************************************************
		#
		# LIMPEZA DE DADOS
		# 
		**********************************************************/
		// Limpa propriedades do componente, o que resulta em retornar o display ao seu valor padrão
		limpar() {

			this.msgErro = '';
			this.atual = '';
			this.anterior = null;
			this.nomeOperacao = '';
			this.operacaoAdicionada = false;
			this.calculo = '';
			this.calculoFinalizado = false;
			this.calculoQueFoiFeito = '';

		},

		/*********************************************************
		#
		# INSERÇÃO DE CARACTERES
		# 
		**********************************************************/
		// Adiciona caracter informado dentro da propriedade "atual"
		adicionarCaracter(caracter) {

			// Limpamos mensagem de erro
			this.limparMensagemDeErro();

			// Só permitimos adicionar um ponto por vez.
			// Ou seja, caso o caracter . (ponto) seja encontrado na propriedade "atual", encerramos execução do método
			if (caracter === '.' && this.atual.includes('.'))  {
				return;
			}

			// Caso estejamos adicionando o caracter . (ponto) e a propriedade "atual" esteja vazia, adicionamos 0 (zero) a propriedade "atual"
			if (caracter === '.' && this.atual == '') {
				this.atual = '0';
			}

			// Caso alguma operação já tenha sido adicionada
			if (this.operacaoAdicionada) {

				// Limpamos a propriedade "atual"
				this.atual = '';

				// Limpamos nome da operação utilizada
				this.nomeOperacao = '';

				// Sinalizamos que não existe mais operação em uso
				this.sinalizarOperacaoVazia();

			}

			// Inserimos caracter na propriedade "atual"
			this.atual = `${this.atual}${caracter}`;

		},

		// Adiciona operação que deve ser utilizada
		adicionarOperacao(operacao) {

			// Limpamos mensagem de erro
			this.limparMensagemDeErro();

			// Só permitimos adicionar uma operação por vez.
			// Ou seja, caso já exista uma fórmula dentro da propriedade "calculo", encerramos execução do método.
			// A única exceção é para o caso da operação que está sendo adicionada ser "porcentagem".
			//if (this.calculo !== '' && this.nomeOperacao !== 'multiplicacao' && operacao !== 'porcentagem') {
			if (this.calculo !== '') {
				return;
			}

			// Caso um cálculo já tenha sido finalizado
			if (this.calculoFinalizado) {

				// Limpamos texto do cálculo sendo executado
				this.calculoQueFoiFeito = '';

				// Sinalizamos que não existe cálculo concluído
				this.sinalizarCalculoNaoFoiFinalizado();

			}

			// Verifico se a propriedade "atual" está vazia
			if (this.atual == '') {

				// Definimos valor da propriedade "atual" como 0 (zero).
				// Fazemos isso porque a propriedade "atual" tem que possuir um valor antes da inclusão de uma operação e o valor padrão desta propriedade é 0 (zero).
				// O usuário pode querer fazer um cálculo começando com 0 (zero).
				this.atual = '0';

			}

			// Definimos o nome do tipo de operação que será usada no cálculo
			this.nomeOperacao = operacao;

			// Adicionamos dados ao registro em texto do cálculo sendo executado
			this.calculoQueFoiFeito += `${this.atual} ${simbolosOperacoes[operacao]} `;

			// Definimos qual fórmula será usada no próximo cálculo
			this.calculo = formulas[operacao];

			// Inserimos valor da propriedade "atual" dentro da propriedade "anterior"
			this.setarAnterior(this.atual);

			// Sinalizamos que existe uma operação adicionada para uso
			this.sinalizarOperacaoAdicionada();

		},

		// Alterna sinais de positivo (+) e negativo (-) dentro da propriedade "atual"
		alternarSinal() {

			// Limpamos mensagem de erro
			this.limparMensagemDeErro();

			// Caso o que está na propriedade "atual" for diferente de 0 (zero) e diferente de vazio
			if (this.atual !== '0' && this.atual !== '') {

				// Verifica se o que está na propriedade "atual" possui o sinal negativo (-) na frente. 
				// Caso não possua, então adiciona. Caso possua, então remove.
				this.atual = this.atual.charAt(0) === '-' ? this.atual.slice(1) : `-${this.atual}`;

			}

		},

		// Converte valor presente na propriedade "atual" em porcentagem, 
		// permitindo que seja usada num cálculo de multiplicação para localizar determinado percentual de um determinado número
		converterEmPorcentagem() {

			// Caso o que está na propriedade "atual" for diferente de 0 (zero) e diferente de vazio
			if (this.atual !== '0' && this.atual !== '') {

				// Efetuamos cálculo para conversão
				this.atual = this.atual / 100;

			}

		},

		/*********************************************************
		#
		# REMOÇÃO DE CARACTERES
		# 
		**********************************************************/
		// Removo último caracter da propriedade atual
		removerCaracter() {

			this.atual = this.atual.toString().slice(0, -1);

		},

		/*********************************************************
		#
		# CONTROLE DA PROPRIEDADE "anterior"
		# 
		**********************************************************/
		// Defino valor da propriedade "anterior"
		setarAnterior(caracter) {

			this.anterior = caracter;

		},

		// Limpamos valor da propriedade "anterior"
		limparAnterior() {

			this.anterior = '';

		},

		/*********************************************************
		#
		# CONTROLE DA PROPRIEDADE "operacaoAdicionada"
		# 
		**********************************************************/
		// Sinalizamos que não existe operação para uso
		sinalizarOperacaoVazia() {

			// Altera propriedade para false
			this.operacaoAdicionada = false;

		},

		// Sinalizamos que uma operação foi adicionada para uso
		sinalizarOperacaoAdicionada() {

			// Altera propriedade para true
			this.operacaoAdicionada = true;

		},

		/*********************************************************
		#
		# CONTROLE DA PROPRIEDADE "calculo"
		# 
		**********************************************************/

		// Limpamos valor da propriedade "calculo"
		limparCalculo() {

			this.calculo = '';

		},

		/*********************************************************
		#
		# CONTROLE DA PROPRIEDADE "calculoFinalizado"
		# 
		**********************************************************/
		// Sinalizamos que não existe cálculo concluído
		sinalizarCalculoNaoFoiFinalizado() {

			// Altera propriedade para false
			this.calculoFinalizado = false;

		},

		// Sinalizamos que um cálculo já foi finalizado
		sinalizarCalculoFoiFinalizado() {

			// Altera propriedade para true
			this.calculoFinalizado = true;

		},

		/*********************************************************
		#
		# CONTROLE DA PROPRIEDADE "msgErro"
		# 
		**********************************************************/
		// Limpamos valor da propriedade "msgErro"
		limparMensagemDeErro() {

			this.msgErro = '';

		},

		/*********************************************************
		#
		# EXECUÇÃO DE CALCULOS / OPERAÇÕES
		# 
		**********************************************************/
		// Executamos cálculo de acordo com a fórmula presente na propriedade "calculo"
		calcular() {

			// Só prosseguimos se existirem valores nas propriedades "anterior", "atual" e "calculo"
			if (this.anterior == '' || this.atual == ''  || this.calculo == '') {
				return;
			}

			// Adicionamos dados ao registro em texto do cálculo sendo executado
			this.calculoQueFoiFeito += `${this.atual}`;

			// Inserimos novo registro no array de histórico
			this.historico.splice(0, 0, this.calculoQueFoiFeito);

			try {

				// Executamos operação
				var resultado = `${this.calculo(
					parseFloat(this.anterior),
					parseFloat(this.atual)
				)}`;

			} catch (error) {

				// Limpo propriedades do componente
				this.limpar();

				// Adicionamos mensagem de erro a div apropriada
				this.msgErro = error.message;

				// Encerro execução
				return;

			}

			// Garante que resultado é do tipo número
			resultado = Number(resultado);

			// Verifica se o resultado é um número inteiro.
			// Caso seja "float", aplicaremos formatação adicional.
			if (!Number.isInteger(resultado)) {

				// Formatamos a quantidade de casas decimais
				resultado = resultado.toFixed(8);

			}
			
			// Insiro resultado dentro da propriedade "atual"
			this.atual = `${resultado}`;

			// Sinalizamos que o cálculo já foi finalizado
			this.sinalizarCalculoFoiFinalizado();

			// Sinalizamos que não existe mais operação em uso
			this.sinalizarOperacaoVazia();

			// Limpamos nome da operação utilizada
			this.nomeOperacao = '';

			// Limpamos valor da propriedade "anterior"
			this.limparAnterior();

			// Limpamos valor da propriedade "calculo"
			this.limparCalculo();

		},

		/*********************************************************
		#
		# DEPURAÇÃO / DEBUG
		# 
		**********************************************************/
		// Retorna informações da execução para depuração. O retorno é exibido através de console.log()
		depuracao() {
			
			console.log('Operação foi Adicionada? ' + this.operacaoAdicionada);
			console.log('Nome da Operação: ' + this.nomeOperacao);
			console.log('Valor Anterior (a): ' + this.anterior);
			console.log('Valor Atual (b): ' + this.atual);
			console.log('Texto do Cálculo: ' + this.calculoQueFoiFeito);
			console.log('Histórico de Cálculos: ' + this.historico);

		}

	}
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.noselect {
	-webkit-touch-callout: none; /* iOS Safari */
	-webkit-user-select: none; /* Safari */
	-khtml-user-select: none; /* Konqueror HTML */
	-moz-user-select: none; /* Old versions of Firefox */
	-ms-user-select: none; /* Internet Explorer/Edge */
	user-select: none; /* Non-prefixed version, currently supported by Chrome, Edge, Opera and Firefox */
}

.calculadora {
	width: 100%;
	padding: 20px;
	padding-left: 30px;
	padding-right: 30px;
	border: 1px solid #dddddd;
	border-radius: 10px;
	background-color: #ffffff;
	font-size: calc(100% + 1vw + 1vh); /* 40px */
}

.display {
	background-color: #333333;
	color: #ffffff;
	font-size: 60px;
	text-align: right;
}

.valor-atual {
	line-height: 1.2;
}

.operacao-executada {
	border: 0px solid #ffffff;
	font-size: 16px;
	margin-bottom: 0px;
}

.botao {
	cursor: pointer;
	background-color: #f2f2f2;
	border: 1px solid #dbdbdb;
}

.botao:not(.operador):not(.controlador):not(.apagar):hover {
	background-color: #dedede;
	border: 1px solid #999999;
}

.botao:active {
	transform: translate(2px, 2px);
}

.controlador {
	background-color: #20b0f7;
	color: #ffffff;
}

.controlador:hover {
	opacity: 0.7;
}

.operador {
	background-color: #f5bd22;
	color: #ffffff;
}

.operador:hover {
	opacity: 0.7;
}

.apagar {
	background-color: #d9534f;
	color: #ffffff;
}

.apagar:hover {
	opacity: 0.7;
}

.mensagem-erro {
	font-size: 16px;
	color: #ffffff;
}

.cursor {
	display: inline-block;
	margin-left: -3px;
	animation: blink-animation 1s steps(2, start) infinite;
}

@keyframes blink-animation {
	to {
		visibility: hidden;
	}
}

@media only screen and (max-width: 576px) {

	.valor-atual {
		font-size: 48px;
	}

	.mensagem-erro {
		font-size: 15px;
	}

}
</style>
