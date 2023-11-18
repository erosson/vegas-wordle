<script lang="ts">
	import * as W from '$lib/words.js';
	const list = W.list();
</script>

<a href={W.source}>wordlist source</a>
<details>
	<summary>{list.length} words</summary>
	<pre>{list.join('\n')}</pre>
</details>
