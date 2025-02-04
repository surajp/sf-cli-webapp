// src/routes/api/execute.js
import { exec } from "child_process";

/** @type {import('@sveltejs/kit').RequestHandler} */
export async function post({ request }) {
  const { command } = await request.json();

  return new Promise((resolve) => {
    exec(command, (error, stdout, stderr) => {
      if (error) {
        resolve({
          status: 500,
          body: { error: error.message, stderr },
        });
      } else {
        resolve({
          status: 200,
          body: { stdout },
        });
      }
    });
  });
}
