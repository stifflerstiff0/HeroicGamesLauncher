import { configStore, fixAsarPath, publicDir } from '../constants'
import {
  createAbortController,
  deleteAbortController
} from '../utils/abort/abort'
import { splitPathAndName } from '../utils/format/format'
import { join } from 'path'
import { runGogdlCommand } from './library'

function getGOGdlBin(): { dir: string; bin: string } {
  const settings = configStore.get('settings', {}) as { altGogdlBin: string }
  if (settings?.altGogdlBin) {
    return splitPathAndName(settings.altGogdlBin)
  }
  return splitPathAndName(
    fixAsarPath(join(publicDir, 'bin', process.platform, 'gogdl'))
  )
}

const getGogdlVersion = async () => {
  const abortID = 'gogdl-version'
  const { stdout, error } = await runGogdlCommand(
    ['--version'],
    createAbortController(abortID)
  )

  deleteAbortController(abortID)

  if (error) {
    return 'invalid'
  }

  return stdout
}

export { getGOGdlBin, getGogdlVersion }
