import mqtt from 'mqtt';

export const BIKE_RED = '#C32823';
export const BIKE_BLUE = '#007CB7';

export enum State {
	Idle,
	Running,
	Finished
}

const TIMER_TICK_MS = 10;
const START_DELAY_MS = 5000;

let timerInterval: ReturnType<typeof setInterval> | undefined;
let delayedStartTimeout: ReturnType<typeof setTimeout> | undefined;
let timerStartedAt = 0;
let timerBaseMs = 0;

export const ui = $state({
	n_bikes: 2,
	winner: 0,
	state: State.Idle,
	level: [62, 65],
	timer: 0
});

function clearTimerInterval() {
	if (!timerInterval) {
		return;
	}
	clearInterval(timerInterval);
	timerInterval = undefined;
}

function clearDelayedStart() {
	if (!delayedStartTimeout) {
		return;
	}
	clearTimeout(delayedStartTimeout);
	delayedStartTimeout = undefined;
}

function startTimer() {
	if (timerInterval) {
		return;
	}

	timerBaseMs = ui.timer;
	timerStartedAt = Date.now();
	timerInterval = setInterval(() => {
		ui.timer = timerBaseMs + (Date.now() - timerStartedAt);
	}, TIMER_TICK_MS);
}

function pauseTimer() {
	if (!timerInterval) {
		return;
	}

	ui.timer = timerBaseMs + (Date.now() - timerStartedAt);
	clearTimerInterval();
	timerBaseMs = ui.timer;
}

function resetTimer(ms = 0) {
	const value = Math.max(0, ms);
	ui.timer = value;
	timerBaseMs = value;
	timerStartedAt = Date.now();
}

function stopTimer() {
	clearDelayedStart();
	pauseTimer();
	resetTimer(0);
}

function message_handler(topic: string, payload: Record<string, unknown>) {
	console.log('Handling message for topic:', topic, 'with payload:', payload);
	switch (topic) {
		case 'reload':
			location.reload();
			break;
		case 'gauge/left': {
			const value = payload['value'];
			if (typeof value === 'number' || typeof value === 'string') {
				ui.level[0] = Number(value);
			}
			break;
		}
		case 'gauge/right': {
			const value = payload['value'];
			if (typeof value === 'number' || typeof value === 'string') {
				ui.level[1] = Number(value);
			}
			break;
		}
		case 'gauges': {
			const l = payload['left'];
			if (typeof l === 'number' || typeof l === 'string') {
				ui.level[0] = Number(l);
			}
			const r = payload['right'];
			if (typeof r === 'number' || typeof r === 'string') {
				ui.level[1] = Number(r);
			}
			break;
		}
		case 'timer/pause':
			pauseTimer();
			break;

		case 'start': {
			if (ui.state === State.Running) {
				return;
			}
			const n = payload['n'];
			if (typeof n === 'number' || typeof n === 'string') {
				ui.n_bikes = Number(n);
			}

			ui.state = State.Running;
			stopTimer();
			clearDelayedStart();
			delayedStartTimeout = setTimeout(() => {
				delayedStartTimeout = undefined;
				startTimer();
			}, START_DELAY_MS);
			break;
		}
		case 'finish': {
			clearDelayedStart();
			if (ui.state !== State.Running) {
				return;
			}
			const winner = payload['w'];
			if (typeof winner === 'number' || typeof winner === 'string') {
				ui.winner = Number(winner);
			}
			pauseTimer();
			ui.state = State.Finished;
			break;
		}
		case 'reset':
			ui.state = State.Idle;
			stopTimer();
			break;
	}
}

export function init_client(broker_url: string | null, base_topic: string | null) {
	if (!broker_url || !base_topic) {
		console.error('Missing query params B or T');
		return;
	}

	console.log('Connecting to broker:', broker_url);
	const client = mqtt.connect(broker_url);

	client.on('connect', function () {
		console.log('Connected to broker');
		console.log('Subscribing to topic:', base_topic + '/#');
		client.subscribe(base_topic + '/#', { qos: 1 });
	});

	client.on('message', function (topic: string, message: Buffer) {
		console.log('Received message:', topic.toString(), ' : ', message.toString());
		try {
			const obj = JSON.parse(message.toString());
			topic = topic.slice(base_topic.length); // remove base topic from topic string
			if (topic.startsWith('/')) {
				topic = topic.slice(1); // remove leading slash if present
			}
			message_handler(topic, obj);
		} catch (error) {
			console.log('Error parsing message as JSON:', error);
		}
	});
}
