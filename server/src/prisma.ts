/**
 * Prisma Database Client Configuration
 * 
 * This module initializes and exports a singleton instance of the Prisma client.
 * The Prisma client provides type-safe database access and query building
 * for the SQLite database.
 * 
 * Features:
 * - Type-safe database operations
 * - Automatic query optimization
 * - Connection pooling and management
 * - Migration support
 * - Database introspection
 * 
 * Usage:
 * Import this client throughout the application to perform database operations:
 * 
 * ```typescript
 * import { prisma } from './prisma';
 * 
 * const users = await prisma.user.findMany();
 * const user = await prisma.user.create({ data: { email: 'test@example.com' } });
 * ```
 * 
 * The client is configured via the DATABASE_URL environment variable
 * specified in the Prisma schema file.
 */

import { PrismaClient } from "@prisma/client";

/**
 * Singleton Prisma Client Instance
 * 
 * This instance is shared across the entire application to avoid
 * creating multiple database connections. Prisma automatically
 * handles connection pooling and management.
 */
export const prisma = new PrismaClient();