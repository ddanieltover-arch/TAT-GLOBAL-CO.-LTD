export async function register() {
  const {logProductionEnvWarnings} = await import('./lib/env');
  logProductionEnvWarnings();
}
