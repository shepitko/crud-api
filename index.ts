import 'dotenv/config';
import { App } from './src/App';

const bootstrap = () => {
    try {
		const app = new App();
		app.init();
	} catch (e) {
        console.log(e)
    }
}

bootstrap();