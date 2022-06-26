## Simple CRUD API without frameworks
Implemented base architecture/simple framework, users endpoint and test for it. Web server can scaling on all CPU cores

### How to start
- node version must be 16 LTS
- `npm intall`

### Commands
- `npm run start:dev` - start dev server
- `npm run start:dev:inspect` - start dev server in debug mode
- `npm run start:prod` - start production build
- `npm run start:multi` - start multi-server which scale to all CPU's cores
- `npm run lint` - check and show all eslint issues
- `npm run test:e2e` - run e2e tests(api)

### Structure
- **/src**
.. **/api** - folder for domains/endpoints
.. **/api / {Entity} / EntityController** -> contains 'routes' and main entities methods(CRUD)
.. **/core** - core "frameworks" classes - routes/db/middlewares;
.. **/helpers** - reusable functions
.. **/models** - entity and types for it, aka ActiveRecord, model has to extends DB for correct saving data
.. **/types** - overrides
- **/tests** - e2e/endpoint test
- **.env** - env variables
- **index.ts** - entry point

### How to add new Endpoint
For example I take `booking`
Need to create:
  - model into folder models e.g. - `src/models/Booking/Booking.ts`
  -- important add following internal code structure 
  ```
    methods: InMemoryDatabase; // take all db methods
	requiredParams: string[]; // need for validation

	constructor() {
		super();
		this.requiredParams = ['startDate', 'city', 'street', 'houseNumber'];
		this.methods = this.workWith('bookings');
	}

	clearData(): void {
		this.clearEntitiesData('bookings'); // necessary for tests
	}
  ```
  - type/interface for this model -  `src/models/Booking/Booking.t.ts`
  - controller - `api/bookings/BookingController.ts` add next code
  -- and won't forget about create handlers for each routers
  ```
    booking: BookingModel; // interaction with model data
	router: Router;

	constructor(router: Router, model: BookingModel) {
		this.booking = model;
		this.router = router;
	}

	routes(): void {
		this.router.get('/api/bookings', this.getBookings);
		this.router.post('/api/bookings', this.createBooking);
		this.router.get('/api/bookings/:id', this.getBookingById);
		this.router.put('/api/bookings/:id', this.updateBooking);
		this.router.delete('/api/bookings/:id', this.deleteBooking);
	}
  ```
  - PROFIT!!!