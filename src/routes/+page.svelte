<script lang="ts">
	import * as W from '$lib/words.js';
	import * as M from '$lib/model.js';

	let game = M.init(W.list());
	let num = 0;
	const winMessages = ['Genius', 'Magnificent', 'Impressive', 'Splendid', 'Great', 'Phew'];

	function next() {
		num += 1;
	}
	function reset() {
		for (let i = 0; i < 10; i++) {
			// sometimes we get "guesslist is empty" while generating the game state.
			// I don't care to debug why right now, this is a rush job. retry.
			try {
				game = M.guessUntilDone(M.init(W.list()));
				num = 0;
				break;
			} catch (e) {
				console.error(e);
			}
		}
	}
	function isDone() {
		return num >= game.guesses.length;
	}
	function nextOrReset() {
		return isDone() ? reset() : next();
	}

	reset();
</script>

<div class="">
	<button on:click={nextOrReset}>{isDone() ? 'Play again' : 'Spin'}</button>
	<ul style="font-family:monospace">
		{#each game.guesses.slice(0, num) as guess}
			<li>
				{#each M.wordHints(game.answer, guess) as hint}
					<span class={`hint hint-${hint.value.toLowerCase()}`}>{hint.letter}</span>
				{/each}
			</li>
		{/each}
	</ul>
	<div>
		{#if isDone()}
			{#if M.isWin(game)}
				<p>{winMessages[game.guesses.length - 1]}</p>
			{:else}
				<pre>{game.answer}</pre>
			{/if}
		{/if}
	</div>
</div>

<details>
	<summary style="color: black">debug info</summary>

	<div>answer: {game.answer}</div>
	<div>guesses: {game.guesses.length}</div>
	<div>narrowed: {M.narrow(game).length}</div>
	<ul>
		{#each game.guesses as guess, index}
			<li>{guess} ({M.narrow(game, index + 1).length})</li>
		{/each}
	</ul>

	<a href={W.source}>wordlist source</a>
	<details>
		<summary>{game.list.length} words</summary>
		<pre>{game.list.join('\n')}</pre>
	</details>
</details>

<style>
	:global(html),
	:global(body) {
		background-color: black;
		color: white;
	}
	li {
		list-style: none;
	}
	.hint {
		display: inline-block;
		padding: 0.5em;
		border-color: black;
		color: white;
		font-weight: bold;
	}
	.hint-black {
		background-color: black;
	}
	.hint-yellow {
		background-color: #ffa405;
	}
	.hint-green {
		background-color: green;
	}
</style>
