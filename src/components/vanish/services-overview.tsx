'use client'

import { vanishLabsConfig, type VanishService } from '@/lib/vanish-config'

interface ServiceCardProps {
  service: VanishService
}

function ServiceCard({ service }: ServiceCardProps) {
  const statusColors: Record<string, string> = {
    live: 'bg-green-500',
    development: 'bg-yellow-500', 
    research: 'bg-blue-500',
  }

  const priorityColors: Record<string, string> = {
    high: 'border-red-500',
    medium: 'border-yellow-500',
    low: 'border-gray-500',
  }

  return (
    <div className={`border-2 ${priorityColors[service.priority]} rounded-lg p-4 bg-card`}>
      <div className="flex items-center justify-between mb-2">
        <h3 className="font-semibold text-lg">{service.name}</h3>
        <div className={`w-3 h-3 rounded-full ${statusColors[service.status]}`} />
      </div>
      
      <p className="text-sm text-muted-foreground mb-3">
        {service.description}
      </p>
      
      <div className="flex items-center justify-between text-xs">
        <span className="bg-secondary px-2 py-1 rounded">
          {service.category}
        </span>
        
        {service.url && (
          <a 
            href={service.url} 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-blue-400 hover:underline"
          >
            Visit →
          </a>
        )}
        
        {service.port && (
          <span className="text-muted-foreground">
            :{service.port}
          </span>
        )}
      </div>
    </div>
  )
}

export function ServicesOverview() {
  const liveServices = vanishLabsConfig.services.filter(s => s.status === 'live')
  const devServices = vanishLabsConfig.services.filter(s => s.status !== 'live')

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Vanish Labs Services</h2>
        <div className="text-sm text-muted-foreground">
          {liveServices.length} live • {devServices.length} in development
        </div>
      </div>

      {/* Live Services */}
      <div>
        <h3 className="text-lg font-semibold mb-3 text-green-400">Production Services</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {liveServices.map((service, index) => (
            <ServiceCard key={index} service={service} />
          ))}
        </div>
      </div>

      {/* Development Services */}
      {devServices.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold mb-3 text-yellow-400">In Development</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {devServices.map((service, index) => (
              <ServiceCard key={index} service={service} />
            ))}
          </div>
        </div>
      )}

      {/* Infrastructure Info */}
      <div className="border rounded-lg p-4 bg-muted/50">
        <h3 className="text-lg font-semibold mb-3">Infrastructure</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h4 className="font-medium">{vanishLabsConfig.infrastructure.primary.name}</h4>
            <p className="text-sm text-muted-foreground">
              {vanishLabsConfig.infrastructure.primary.description}
            </p>
          </div>
          <div>
            <h4 className="font-medium">{vanishLabsConfig.infrastructure.remote.name}</h4>
            <p className="text-sm text-muted-foreground">
              {vanishLabsConfig.infrastructure.remote.description}
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              {vanishLabsConfig.infrastructure.remote.location}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}