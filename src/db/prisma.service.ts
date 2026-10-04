import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '../generated/prisma/client.js';
import { PrismaPg } from '@prisma/adapter-pg';
import pkg from 'pg';

const { Pool } = pkg;

// Marks this class as a NestJS provider so it can be injected into other services
@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {

    constructor() {

        const databaseUrl = process.env.DATABASE_URL;

        if (!databaseUrl) {
            throw new Error('DATABASE_URL environment variable is missing or not loaded.');
        }

        const pool = new Pool({ connectionString: databaseUrl });
        const adapter = new PrismaPg(pool);

        super({ adapter })
    }

    async onModuleInit() {
        await this.$connect()
    }

}