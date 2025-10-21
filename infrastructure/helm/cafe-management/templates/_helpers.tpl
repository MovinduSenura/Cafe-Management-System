{{/*
Expand the name of the chart.
*/}}
{{- define "cafe-management.name" -}}
{{- default .Chart.Name .Values.nameOverride | trunc 63 | trimSuffix "-" }}
{{- end }}

{{/*
Create a default fully qualified app name.
*/}}
{{- define "cafe-management.fullname" -}}
{{- if .Values.fullnameOverride }}
{{- .Values.fullnameOverride | trunc 63 | trimSuffix "-" }}
{{- else }}
{{- $name := default .Chart.Name .Values.nameOverride }}
{{- if contains $name .Release.Name }}
{{- .Release.Name | trunc 63 | trimSuffix "-" }}
{{- else }}
{{- printf "%s-%s" .Release.Name $name | trunc 63 | trimSuffix "-" }}
{{- end }}
{{- end }}
{{- end }}

{{/*
Create chart name and version as used by the chart label.
*/}}
{{- define "cafe-management.chart" -}}
{{- printf "%s-%s" .Chart.Name .Chart.Version | replace "+" "_" | trunc 63 | trimSuffix "-" }}
{{- end }}

{{/*
Common labels
*/}}
{{- define "cafe-management.labels" -}}
helm.sh/chart: {{ include "cafe-management.chart" . }}
{{ include "cafe-management.selectorLabels" . }}
{{- if .Chart.AppVersion }}
app.kubernetes.io/version: {{ .Chart.AppVersion | quote }}
{{- end }}
app.kubernetes.io/managed-by: {{ .Release.Service }}
{{- end }}

{{/*
Selector labels
*/}}
{{- define "cafe-management.selectorLabels" -}}
app.kubernetes.io/name: {{ include "cafe-management.name" . }}
app.kubernetes.io/instance: {{ .Release.Name }}
{{- end }}

{{/*
Service labels
*/}}
{{- define "cafe-management.serviceLabels" -}}
{{ include "cafe-management.labels" . }}
app.kubernetes.io/component: {{ .serviceName }}
{{- end }}

{{/*
Create the name of the service account to use
*/}}
{{- define "cafe-management.serviceAccountName" -}}
{{- if .Values.serviceAccount.create }}
{{- default (include "cafe-management.fullname" .) .Values.serviceAccount.name }}
{{- else }}
{{- default "default" .Values.serviceAccount.name }}
{{- end }}
{{- end }}

{{/*
Generate image name
*/}}
{{- define "cafe-management.image" -}}
{{- $registry := .Values.global.imageRegistry | default .Values.image.registry -}}
{{- $repository := .Values.image.repository -}}
{{- $tag := .Values.image.tag | default .Chart.AppVersion -}}
{{- if $registry }}
{{- printf "%s/%s/%s:%s" $registry $repository .serviceName $tag }}
{{- else }}
{{- printf "%s/%s:%s" $repository .serviceName $tag }}
{{- end }}
{{- end }}

{{/*
Generate MongoDB connection string
*/}}
{{- define "cafe-management.mongodbConnectionString" -}}
{{- if .Values.mongodb.enabled }}
{{- printf "mongodb://%s:%s@%s-mongodb:27017/%s" (index .Values.mongodb.auth.usernames 0) (index .Values.mongodb.auth.passwords 0) .Release.Name (index .Values.mongodb.auth.databases 0) }}
{{- else }}
{{- .Values.externalMongodb.connectionString }}
{{- end }}
{{- end }}

{{/*
Generate Redis connection string
*/}}
{{- define "cafe-management.redisConnectionString" -}}
{{- if .Values.redis.enabled }}
{{- printf "redis://:%s@%s-redis-master:6379" .Values.redis.auth.password .Release.Name }}
{{- else }}
{{- .Values.externalRedis.connectionString }}
{{- end }}
{{- end }}