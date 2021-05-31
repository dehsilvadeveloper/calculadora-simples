<template>
	
	<div class="container h-100">

		<h1 class="mb-4 text-light">Calculadora em Vuejs</h1>

		<Calculadora />

		<footer class="mt-5">
			<p>&copy; 2021 André Silva</p>
		</footer>

	</div>

</template>

<script>
import Calculadora from './components/Calculadora.vue'

export default {
	name: 'App',
	components: {
		Calculadora
	}
}
</script>

<style>
footer {
	color: #ffffff;
	font-size: 12px;
}

#app {
	font-family: Avenir, Helvetica, Arial, sans-serif;
	-webkit-font-smoothing: antialiased;
	-moz-osx-font-smoothing: grayscale;
	text-align: center;
	color: #2c3e50;
	margin-top: 10px;
}
</style>
