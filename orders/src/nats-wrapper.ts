import nats, { Stan } from 'node-nats-streaming';

class NatsWrapper {
    // * underscore and ? at end will tell TS that the below 
    // * value will remain undefined for certain amount of time
    private _client?: Stan;

    // * this is a getter function to access private client field 
    get client() {
        if (!this._client) {
            throw new Error('Cannot access NATS before connecting')
        }

        return this._client;
    }

    connect(clusterId: string, clientId: string, url: string): Promise<void> {
        this._client = nats.connect(clusterId, clientId, { url });

        return new Promise((resolve, reject) => {
           this.client.on('connect', () => {
                console.log('Connected to NATS');
                resolve();
            });
            
            this.client.on('error', (err) => {
                reject(err);
            });

        })
    }

}

export const natsWrapper = new NatsWrapper();