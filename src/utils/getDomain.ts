export default function getDomain() {
  return process.env.BETA
    ? "https://duckit.pitlor.dev"
    : "https://jeepduckit.com";
}
