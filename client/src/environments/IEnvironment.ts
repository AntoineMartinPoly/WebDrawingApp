export interface IEnvironment {
    production: boolean;
    firebase: {
        apiKey: string,
        authDomain: string,
        databaseURL: string,
        projectId: string,
        storageBucket: string,
        messagingSenderId: string,
      };
}
