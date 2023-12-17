export default interface Service {
  binding(prog: String, lang: String): Promise<Array<string>>;
  did_to_js(prog: String): Promise<Array<string>>;
}
