export class CarteCredit {
  id?: number;
  utilisateur_id: number;
  numero_carte: string;
  expiration_date: string;
  titulaire: string;
  cryptogramme: string;

  constructor(utilisateur_id: number, numero_carte: string, expiration_date: string, titulaire: string, cryptogramme: string) {
    this.utilisateur_id = utilisateur_id;
    this.numero_carte = numero_carte;
    this.expiration_date = expiration_date;
    this.titulaire = titulaire;
    this.cryptogramme = cryptogramme;
  }
}
