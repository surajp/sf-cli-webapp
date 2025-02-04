export const ssr = false;

export async function load({ fetch }) {
  let res = await fetch("/sfcommands.json");
  let commands = await res.json();
  commands = JSON.parse(
    JSON.stringify(commands).replaceAll("<%= config.bin %>", "sf"),
  );
  res = await fetch("/sfdxaliases.json");
  const orgs = await res.json();
  let orgNames = Object.values(orgs.result)
    .flatMap((category) => category.map((org) => org.alias || org.username))
    .filter((name, index, arr) => arr.indexOf(name) === index);
  return { orgNames, commands };
}
