// SPDX-FileCopyrightText: 2026 Jacques Supcik <jacques.supci@hefr.ch>
//
// SPDX-License-Identifier: MIT

import { Duration } from 'luxon';

export function formatTimer(value: unknown): string {
	const raw = typeof value === 'number' ? value : Number(value);
	const millis = Number.isFinite(raw) ? Math.max(0, raw) : 0;
	const withMillis = Duration.fromMillis(millis).toFormat('mm:ss:SSS');

	// Keep hundredths (XX) by dropping the last millisecond digit.
	return withMillis.slice(0, -1);
}
