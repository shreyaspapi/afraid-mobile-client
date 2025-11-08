# GraphQL Code Generation Guide

This project uses GraphQL Code Generator to automatically generate TypeScript types from your Unraid server's GraphQL schema.

## Quick Start

1. **Get your API key** from your Unraid server (if you haven't already):
   ```bash
   # On your Unraid server
   unraid-api apikey --create
   ```

2. **Run codegen with your credentials**:
   ```bash
   UNRAID_SCHEMA_URL=http://192.168.21.1/graphql API_KEY=your_api_key_here pnpm run codegen
   ```

   Or update `codegen.ts` with your default URL and just provide the API key:
   ```bash
   API_KEY=your_api_key_here pnpm run codegen
   ```

## What Gets Generated

Running codegen will:
- ✅ Introspect your Unraid GraphQL schema
- ✅ Generate TypeScript types for all queries
- ✅ Generate React hooks for each query
- ✅ Create type-safe query functions
- ✅ Output everything to `src/gql/`

## Using Generated Types

After running codegen, you can use the generated hooks:

```typescript
import { useGetDashboardDataQuery } from '@/src/gql';

function MyComponent() {
  const { data, loading, error } = useGetDashboardDataQuery();
  
  // data is fully typed!
  const cpuLoad = data?.info?.cpu?.currentLoad;
}
```

## Troubleshooting

### Connection Timeout
- ✅ Make sure your Mac/computer is on the same network as Unraid
- ✅ Verify the server URL is correct: `http://YOUR_IP:PORT/graphql`
- ✅ Test the connection: `curl http://YOUR_IP:PORT/graphql`

### Authentication Required
- ✅ Make sure you provide the `API_KEY` environment variable
- ✅ Verify your API key is correct

### Schema Not Found
- ✅ Check that the GraphQL endpoint is accessible
- ✅ Verify Unraid API is running: `systemctl status unraid-api`

## Alternative: Manual Schema File

If you can't connect directly, you can:

1. Export the schema from your Unraid server
2. Save it as `schema.graphql` in the project root
3. Update `codegen.ts`:
   ```typescript
   schema: './schema.graphql',
   ```

## Updating Types

Run codegen whenever:
- ✅ The Unraid API schema changes
- ✅ You add new queries
- ✅ You want to refresh types

The generated files in `src/gql/` are auto-generated - don't edit them manually!


curl -H "x-api-key: 89a7ae67e300c9c05441cec0951930de654058ac61bde7f23a3625cec8568781" http://192.168.21.1:3001/graphql \
  -X POST \
  -H "Content-Type: application/json" \
  -d '{"query":"{ __schema { types { name } } }"}' > schema.json

