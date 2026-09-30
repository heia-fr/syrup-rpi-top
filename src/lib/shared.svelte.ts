// SPDX-FileCopyrightText: 2026 Jacques Supcik <jacques.supci@hefr.ch>
//
// SPDX-License-Identifier: MIT

import mqtt from 'mqtt';

export const BIKE_RED = '#C32823';
export const BIKE_BLUE = '#007CB7';

export enum State {
	Idle,
	Ready,
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
	level: [0],
	power: [0, 0],
	timer: 0
});

function isRecord(value: unknown): value is Record<string, unknown> {
	return typeof value === 'object' && value !== null;
}

function toNumber(value: unknown): number | undefined {
	if (typeof value !== 'number' && typeof value !== 'string') {
		return undefined;
	}

	const numericValue = Number(value);
	return Number.isFinite(numericValue) ? numericValue : undefined;
}

function updateValue(values: number[], index: number, value: unknown) {
	const numericValue = toNumber(value);
	if (numericValue !== undefined) {
		values[index] = numericValue;
	}
}

function updatePower(payload: Record<string, unknown>, index: number) {
	updateValue(ui.power, index, payload['power']);
	updateValue(ui.level, index, payload['energy']);
}

function updateBikeCount(payload: Record<string, unknown>) {
	const bikeCount = toNumber(payload['n']);
	if (bikeCount !== undefined) {
		ui.n_bikes = bikeCount;
	}
}

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
		case 'gauge/left':
			updateValue(ui.level, 0, payload['value']);
			break;
		case 'power/left':
			updatePower(payload, 0);
			break;
		case 'gauge/right':
			updateValue(ui.level, 1, payload['value']);
			break;
		case 'power/right':
			updatePower(payload, 1);
			break;
		case 'gauges': {
			for (const [index, value] of [payload['left'], payload['right']].entries()) {
				updateValue(ui.level, index, value);
			}
			break;
		}
		case 'powers': {
			const sides = [payload['left'], payload['right']];
			for (const [index, side] of sides.entries()) {
				if (!isRecord(side)) {
					continue;
				}
				updatePower(side, index);
			}
			break;
		}
		case 'timer/pause':
			pauseTimer();
			break;

		case 'ready': {
			updateBikeCount(payload);

			ui.state = State.Ready;
			ui.level[0] = 0;
			ui.level[1] = 0;
			ui.power[0] = 0;
			ui.power[1] = 0;

			stopTimer();
			clearDelayedStart();
			break;
		}

		case 'start': {
			if (ui.state === State.Running) {
				console.warn('Received start command while already running. Ignoring.');
				return;
			}
			updateBikeCount(payload);

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
			const winner = toNumber(payload['w']);
			if (winner !== undefined) {
				ui.winner = winner;
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
			const payload: unknown = JSON.parse(message.toString());
			if (!isRecord(payload)) {
				console.warn('Ignoring non-object MQTT payload:', payload);
				return;
			}
			topic = topic.slice(base_topic.length); // remove base topic from topic string
			if (topic.startsWith('/')) {
				topic = topic.slice(1); // remove leading slash if present
			}
			message_handler(topic, payload);
		} catch (error) {
			console.log('Error parsing message as JSON:', error);
		}
	});
}
