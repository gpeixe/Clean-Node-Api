export interface HashComparer {
  compare: (authPassword: string, accountPassword: string) => Promise<Boolean>
}
