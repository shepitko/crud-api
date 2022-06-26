import 'dotenv/config';
import { App } from './App';
import cluster from 'cluster';
import os from 'os';

interface IBootstrapReturn {
	app: App;
}

const cpus = os.cpus().length;

function bootstrap({ scale = true }): IBootstrapReturn {
	const app = new App();

	if (scale) {
		const masterProcess = (): void => {
			console.log(`Master ${process.pid} is running`);

			for (let i = 0; i < cpus; i++) {
				console.log(`Forking process number ${i + 1}...`);
				cluster.fork();
			}
		};

		const childProcess = (): void => {
			console.log(`Worker ${process.pid} started...`);
			app.init();
		};

		if (cluster.isPrimary) {
			masterProcess();
		} else {
			childProcess();
		}
	} else {
		app.init();
	}

	return { app };
}

export const boot = ({ scale }: { scale: boolean }): IBootstrapReturn => bootstrap({ scale });

// boot({ scale: true });
