import { exec, ExecOptions } from 'child_process';
import { Writable } from 'stream';

export interface ExecPOptions extends ExecOptions {
  stdout?: Writable;
  stderr?: Writable;
}
export interface ExecPResults {
  stdout: string;
  stderr: string;
}

/**
 * Promisified child_process.exec
 *
 * @param cmd: string containing the command that would be typed at the shell
 * @param opts See child_process.exec node docs
 * @param {stream.Writable} opts.stdout If defined, child process stdout will be piped to it.
 * @param {stream.Writable} opts.stderr If defined, child process stderr will be piped to it.
 *
 * @returns {Promise<{ stdout: string, stderr: stderr }>}
 */
export function execp(cmd: string, opts: ExecPOptions): Promise<ExecPResults> {
  opts || (opts = {});
  return new Promise((resolve, reject) => {
    const child = exec(cmd, opts, (err, stdout, stderr) =>
      err
        ? reject(err)
        : resolve({
            stdout: stdout,
            stderr: stderr,
          })
    );

    if (opts.stdout) {
      child.stdout?.pipe(opts.stdout);
    }
    if (opts.stderr) {
      child.stderr?.pipe(opts.stderr);
    }
  });
}
