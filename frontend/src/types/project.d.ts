import { ConfigFile } from "./config"

export interface Project {
  Name: string
  FilePath: string
  ConfigFiles: ConfigFile[]
  Thumbnail?: string
  Favorite?: boolean
  Sim: {
    Type: string
    Options?: {
      UseFsuipc?: boolean
    }
    Available: boolean
  }
  Controllers: {
    Name: string
    Type: string
    Available: boolean
  }[]
  Aircraft: {
    Name: string
    Filter: string
    Available: boolean
  }[]
}

export interface ProjectSummary {
  Name: string
  Thumbnail?: string
  Favorite?: boolean
  Sim: {
    Type: string
    Options?: {
      UseFsuipc?: boolean
    }
    Available: boolean
  }
  Controllers: {
    Name: string
    Type: string
    Available: boolean
  }[]
  Aircraft: {
    Name: string
    Filter: string
    Available: boolean
  }[]
}
