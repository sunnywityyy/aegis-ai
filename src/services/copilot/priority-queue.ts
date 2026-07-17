export type SeverityPriority = "critical" | "high" | "medium" | "low"

export interface QueuedIncident {
  id: string
  text: string
  priority: SeverityPriority
  timestamp: Date
  location?: string
  category?: string
}

const severityWeights: Record<SeverityPriority, number> = {
  critical: 4,
  high: 3,
  medium: 2,
  low: 1,
}

/**
 * Priority Queue for processing multi-surge stadium incidents.
 * Automatically orders incidents by operational severity (Critical > High > Medium > Low).
 * Ties are broken using FIFO (First-In, First-Out) timestamps.
 */
export class IncidentPriorityQueue {
  private queue: QueuedIncident[] = []

  /**
   * Enqueues an incident, triggering a re-sort.
   */
  enqueue(incident: QueuedIncident): void {
    this.queue.push(incident)
    this.sort()
  }

  /**
   * Batch enqueues multiple incidents.
   */
  enqueueAll(incidents: QueuedIncident[]): void {
    this.queue.push(...incidents)
    this.sort()
  }

  /**
   * Dequeues and returns the highest priority incident.
   */
  dequeue(): QueuedIncident | undefined {
    return this.queue.shift()
  }

  /**
   * Peeks at the highest priority incident without removing it.
   */
  peek(): QueuedIncident | undefined {
    return this.queue[0]
  }

  /**
   * Checks if the queue is empty.
   */
  isEmpty(): boolean {
    return this.queue.length === 0
  }

  /**
   * Returns a copy of the sorted queue array.
   */
  getQueue(): QueuedIncident[] {
    return [...this.queue]
  }

  /**
   * Clears all items in the queue.
   */
  clear(): void {
    this.queue = []
  }

  /**
   * Internal sorter helper using weight indices.
   */
  private sort(): void {
    this.queue.sort((a, b) => {
      const weightA = severityWeights[a.priority] || 0
      const weightB = severityWeights[b.priority] || 0

      if (weightA !== weightB) {
        return weightB - weightA // Descending priority (higher weight first)
      }

      // Break ties by older timestamps first (FIFO)
      return a.timestamp.getTime() - b.timestamp.getTime()
    })
  }
}
