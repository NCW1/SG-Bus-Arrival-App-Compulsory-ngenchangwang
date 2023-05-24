document.addEventListener('DOMContentLoaded', () => {
	const searchButton = document.getElementById('search-button');
	searchButton.addEventListener('click', () => {
		fetchBusArrivals()
			.then(() => {
				const busArrivalTable = document.getElementById('bus-arrival-table');
				busArrivalTable.style.display = 'table';
			})
			.catch(error => console.error(error));
	});
});

function fetchBusArrivals() {
	const busStopInput = document.getElementById('bus-stop-input');
	const busStopId = busStopInput.value;

	const url = `https://arrivelah2.busrouter.sg/?id=${busStopId}`;
	return fetch(url)
		.then(response => response.json())
		.then(data => displayBusArrivals(data));
}

function displayBusArrivals(data) {
	const busArrivalBody = document.getElementById('bus-arrival-body');
	busArrivalBody.innerHTML = '';

	if (data.services && data.services.length > 0) {
		data.services.forEach(service => {
			const busNo = service.no;
			const operator = service.operator;
			const nextArrival = formatNextArrival(service.next.duration_ms);

			const row = document.createElement('tr');
			const busNoCell = document.createElement('td');
			const operatorCell = document.createElement('td');
			const nextArrivalCell = document.createElement('td');

			busNoCell.textContent = busNo;
			operatorCell.textContent = operator;
			nextArrivalCell.textContent = nextArrival;

			row.appendChild(busNoCell);
			row.appendChild(operatorCell);
			row.appendChild(nextArrivalCell);
			busArrivalBody.appendChild(row);
		});
	}
	else {
		const row = document.createElement('tr');
		const noServicesCell = document.createElement('td');
		noServicesCell.setAttribute('colspan', '3');
		noServicesCell.textContent = 'No bus services available!';

		row.appendChild(noServicesCell);
		busArrivalBody.appendChild(row);
	}
}

function formatNextArrival(durationMs) {
	const minutes = Math.floor(durationMs / 1000 / 60);
	return minutes >= 0 ? `${minutes} min` : 'Arrived';
}