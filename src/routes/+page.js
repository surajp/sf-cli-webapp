export const ssr = false;

export async function load({ fetch }) {
  const basePath = import.meta.env.BASE_URL;
  let res = await fetch(`${basePath}sfcommands.json`);
  let commands = await res.json();
  commands = JSON.parse(
    JSON.stringify(commands).replaceAll("<%= config.bin %>", "sf"),
  );
  console.log(commands);
  let orgNames = [];
  try {
    res = await fetch(`${basePath}orgaliases.json`);
    const orgs = await res.json();
    orgNames = Object.values(orgs.result)
      .flatMap((category) => category.map((org) => org.alias || org.username))
      .filter((name, index, arr) => arr.indexOf(name) === index);
  } catch (e) {}
  return { orgNames, commands };
}
