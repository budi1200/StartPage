<script>
	var dayjs = require("dayjs");

	var today = dayjs();

	const updateTime = () => {
		today = dayjs();
		setTimeout(() => updateTime(), 1000);
	};

	updateTime();
</script>

<div id="clock" class="relative text-white mb-3">
	<h1 class="text-5xl">{today.format("HH:MM:ss")}</h1>
	<h3 class="text-base">{today.format("ddd, D MMM YYYY")}</h3>
</div>
