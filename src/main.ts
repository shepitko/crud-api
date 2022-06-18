import 'dotenv/config';
import { App } from './App';

interface IBootstrapReturn {
	app: App;
}

function bootstrap(): IBootstrapReturn {
	const app = new App();

	app.init();

	return { app };
}

export const boot = bootstrap();