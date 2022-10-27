import './index.css'
import React, { useContext, useEffect, useState } from 'react'
import { AreaChart, Area, ResponsiveContainer } from 'recharts'
import { LinearProgress } from '@mui/material'
import LibraryContext from 'frontend/state/LibraryContext'

interface Point {
  download: number
  disk: number
}

const roundToNearestHundredth = function (val: number | undefined) {
  if (!val) return 0
  return Math.round(val * 100) / 100
}

export default function ProgressHeader(props: { appName: string }) {
  const { hasGameStatus } = useContext(LibraryContext)
  const gameStatus = hasGameStatus(props.appName)
  const [avgSpeed, setAvgDownloadSpeed] = useState<Point[]>(
    Array<Point>(10).fill({ download: 0, disk: 0 })
  )

  useEffect(() => {
    if (avgSpeed.length > 9) {
      avgSpeed.shift()
    }

    avgSpeed.push({
      download:
        gameStatus?.progress?.downSpeed && gameStatus?.progress?.downSpeed > 0
          ? gameStatus?.progress?.downSpeed
          : avgSpeed.at(-1)?.download ?? 0,
      disk: gameStatus?.progress?.diskSpeed ?? 0
    })

    setAvgDownloadSpeed([...avgSpeed])
  }, [gameStatus.progress])

  return (
    <div className="progressHeader">
      <div className="downloadRateStats">
        <div className="downloadRateChart">
          <div
            style={{
              width: '100%',
              height: '100%',
              position: 'absolute',
              top: 0,
              left: 0
            }}
          >
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={avgSpeed} margin={{ top: 0, right: 0 }}>
                <Area
                  isAnimationActive={false}
                  type="monotone"
                  dataKey="download"
                  strokeWidth="0px"
                  fill="var(--accent)"
                  fillOpacity={0.5}
                />
                <Area
                  isAnimationActive={false}
                  type="monotone"
                  dataKey="disk"
                  stroke="var(--primary)"
                  strokeWidth="2px"
                  fillOpacity={0}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="realtimeDownloadStatContainer">
          <h3 className="realtimeDownloadStat">
            {roundToNearestHundredth(avgSpeed.at(-1)?.download)} MB/s
          </h3>
          <div className="realtimeDownloadStatLabel downLabel">Down </div>
        </div>
        <div className="realtimeDownloadStatContainer">
          <h3 className="realtimeDownloadStat">
            {roundToNearestHundredth(avgSpeed.at(-1)?.disk)} MB/s
          </h3>
          <div className="realtimeDownloadStatLabel diskLabel">Disk </div>
        </div>
      </div>
      <div className="downloadProgress">
        <div className="downloadProgressStats">
          <p className="downloadStat" color="var(--text-default)">{`${
            gameStatus?.progress?.percent ?? 0
          }%`}</p>
          <p className="downloadStat">{`ETA: ${
            gameStatus?.progress?.eta ?? '00.00.00'
          }`}</p>
        </div>
        <div className="downloadBar">
          <LinearProgress
            variant="determinate"
            className="linearProgress"
            value={gameStatus?.progress?.percent ?? 0}
            sx={{
              height: '10px',
              backgroundColor: 'var(--text-default)',
              borderRadius: '20px'
            }}
          />
        </div>
      </div>
    </div>
  )
}
