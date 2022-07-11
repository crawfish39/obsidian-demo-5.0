import { config } from 'https://deno.land/x/dotenv@v3.2.0/mod.ts';
import { Pool } from 'https://deno.land/x/postgres/mod.ts';

const env = config();

let pgPort: number | string | undefined = env.PG_PORT;
if (typeof pgPort === 'string') {
	pgPort = parseInt(pgPort as string);
}

const dbSettings = {
	user: env.PG_USER,
	database: env.PG_DATABASE,
	password: env.PG_PASSWORD,
	hostname: env.PG_HOSTNAME,
	port: pgPort,
  };

const POOL_CONNECTIONS = 2; // breaks at 10+ due to ElephantSQL

let pool = new Pool(dbSettings, POOL_CONNECTIONS);

const resolvers = {
	Query: {
		plants: async (
			_a: string,
			{ input }: { input: { maintenance?: string; size?: string } }
		) => {
			const client = await pool.connect();
			try {
				let rows;
				if (input && input.maintenance) {
					rows = await client.queryObject<{
						id: number;
						name: string;
						maintenance: string;
						size: string;
						imageurl: string;
					}>({
						text: 'SELECT * FROM obsidian_demo_schema.plants WHERE maintenance = $1',
						args: [input.maintenance],
					});
				} else if (input && input.size) {
					rows = await client.queryObject<{
						id: number;
						name: string;
						maintenance: string;
						size: string;
						imageurl: string;
					}>({
						text: 'SELECT * FROM obsidian_demo_schema.plants WHERE size = $1',
						args: [input.size],
					});
				} else {
					rows = await client.queryObject<{
						id: number;
						name: string;
						maintenance: string;
						size: string;
						imageurl: string;
					}>('SELECT * FROM obsidian_demo_schema.plants');
				}
				console.log('(In resolver getting plants');
				console.log(rows.rows);
				return rows.rows;
			} catch (err) {
				console.log(err);
				console.log('resetting connection');
				pool = new Pool(dbSettings, POOL_CONNECTIONS);
			} finally {
				await client.release();
				await client.end();
			}
		},
		countries: async (
			a: string,
			{ input }: { input: { climate?: string } }
		) => {
			const client = await pool.connect();
			try {
				let rows;
				if (input && input.climate) {
					rows = await client.queryObject<{
						id: number;
						name: string;
						climate: string;
					}>(
						'SELECT * FROM obsidian_demo_schema.countries WHERE climate = $1',
						input.climate
					);
				} else {
					rows = await client.queryObject<{
						id: number;
						name: string;
						climate: string;
					}>('SELECT * FROM obsidian_demo_schema.countries');
				}
				return rows.rows;
			} catch (err) {
				console.log(err);
				console.log('resetting connection');
				pool = new Pool(dbSettings, POOL_CONNECTIONS);
			} finally {
				await client.release();
				await client.end();
			}
		},
	},
	Mutation: {
		addPlant: async (
			_a: string,
			{
				input,
			}: {
				input: {
					name: string;
					maintenance: string;
					size: string;
					imageurl: string;
				};
			}
			) => {
			const client = await pool.connect();
			try {
				console.log(
					'In the resolver: ',
					input.name,
					input.maintenance,
					input.size,
					input.imageurl
				);
				const rows = await client.queryObject<{
					id: number;
					name: string;
					maintenance: string;
					size: string;
					imageurl: string;
				}>({
					text: 'INSERT INTO obsidian_demo_schema.plants (name, maintenance, size, imageurl) VALUES ($1, $2, $3, $4) RETURNING *',
					args: [input.name, input.maintenance, input.size, input.imageurl],
				});
				return rows.rows[0];
			} catch (err) {
				console.log(err);
				console.log('resetting connection');
				pool = new Pool(dbSettings, POOL_CONNECTIONS);
			} finally {
				await client.release();
				await client.end();
			}
		},

		deletePlant: async (_a: string, { id }: { id: string }) => {
			const client = await pool.connect();
			try {
				const { rows } = await client.queryObject<{
					id: number;
					name: string;
					maintenance: string;
					size: string;
					imageurl: string;
				}>({
					text: `
            DELETE FROM obsidian_demo_schema.plants
            WHERE id = $1
            RETURNING *;
          `,
					args: [id],
				});

				
				const deletedPlant = rows[0];
				
				return deletedPlant;
			} catch (err) {
				console.log(err);
				console.log('resetting connection');
				pool = new Pool(dbSettings, POOL_CONNECTIONS);
			} finally {
				await client.release();
				await client.end();
			}
		},
		addCountry: async (
			_a: string,
			{ input }: { input: { climate: string } }
		) => {
			const client = await pool.connect();
			try {
				const rows = await client.queryObject<{
					id: number;
					name: string;
					climate: string;
				}>(
					'INSERT INTO obsidian_demo_schema.countries (name, climate) VALUES ($1, $2) RETURNING *',
					input.name,
					input.climate
				);
				return rows.rows[0];
			} catch (err) {
				console.log(err);
				console.log('resetting connection');
				pool = new Pool(dbSettings, POOL_CONNECTIONS);
			} finally {
				await client.release();
				await client.end();
			}
		},
	},
};

export default resolvers;
