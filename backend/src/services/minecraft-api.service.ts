import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class MinecraftApiService {
  async getServerStatus(address: string, port?: number): Promise<any> {
    try {
      let serverAddress = address.trim();
      const serverPort = port || 25565;
      
      // Formatar endereço para a API
      if (!serverAddress.includes(':')) {
        serverAddress = `${serverAddress}:${serverPort}`;
      }
      
      // Tentar mcstatus.io primeiro (mais confiável)
      try {
        const response = await axios.get(
          `https://api.mcstatus.io/v2/status/java/${encodeURIComponent(serverAddress)}`,
          { timeout: 8000 }
        );

        if (response.data.online) {
          const data = response.data;
          return {
            online: true,
            players: {
              online: data.players?.online || 0,
              max: data.players?.max || 0,
              list: data.players?.list?.map((p: any) => p.name_clean || p.name_raw) || [],
            },
            version: data.version?.name_raw || data.version?.name_clean || 'Unknown',
            motd: {
              raw: data.motd?.raw || [],
              clean: data.motd?.clean || [],
              html: data.motd?.html || [],
            },
            icon: data.icon || null,
            software: data.software || null,
            plugins: data.plugins?.names || [],
            mods: data.mods?.names || [],
            hostname: data.hostname || address,
            ip: data.ip || null,
          };
      }
      } catch (mcstatusError) {
        console.log('mcstatus.io falhou, tentando alternativa...');
      }

      // Fallback 1: mcsrvstat.us
      try {
      const response = await axios.get(
        `https://api.mcsrvstat.us/3/${encodeURIComponent(serverAddress)}`,
          { timeout: 8000 }
      );

      if (response.data.online) {
        const data = response.data;
        return {
          online: true,
          players: {
            online: data.players?.online || 0,
            max: data.players?.max || 0,
            list: data.players?.list || [],
          },
          version: data.version?.name_raw || data.version?.name || 'Unknown',
          motd: {
            raw: data.motd?.raw || [],
            clean: data.motd?.clean || [],
            html: data.motd?.html || [],
          },
          icon: data.icon || null,
          software: data.software || null,
          plugins: data.plugins?.names || [],
          mods: data.mods?.names || [],
          hostname: data.hostname || address,
          ip: data.ip || null,
        };
      }
      } catch (mcsrvstatError) {
        console.log('mcsrvstat.us falhou, tentando última alternativa...');
      }

      // Fallback 2: mcapi.us
      try {
        const cleanAddress = serverAddress.split(':')[0];
        const response = await axios.get(
          `https://mcapi.us/server/status?ip=${encodeURIComponent(cleanAddress)}&port=${serverPort}`,
          { timeout: 8000 }
        );

        if (response.data.status === 'success' && response.data.online) {
          const data = response.data;
          return {
            online: true,
            players: {
              online: data.players?.now || 0,
              max: data.players?.max || 0,
              list: [],
            },
            version: data.server?.name || 'Unknown',
            motd: {
              raw: data.motd ? [data.motd] : [],
              clean: data.motd ? [data.motd] : [],
              html: [],
            },
            icon: null,
            software: null,
            plugins: [],
            mods: [],
            hostname: address,
            ip: cleanAddress,
          };
        }
      } catch (mcapiError) {
        console.log('mcapi.us também falhou');
      }

      // Se ambas falharam, retornar offline
      return {
        online: false,
        players: { online: 0, max: 0, list: [] },
        version: null,
        motd: { raw: [], clean: [], html: [] },
        icon: null,
        software: null,
        plugins: [],
        mods: [],
        hostname: address,
        ip: null,
      };
    } catch (error) {
      console.error('Erro ao buscar status do servidor:', error.message);
      return {
        online: false,
        players: { online: 0, max: 0, list: [] },
        version: null,
        motd: { raw: [], clean: [], html: [] },
        icon: null,
        software: null,
        plugins: [],
        mods: [],
        hostname: address,
        ip: null,
      };
    }
  }

  async getPlayerInfo(username: string): Promise<any> {
    try {
      const response = await axios.get(
        `https://api.mojang.com/users/profiles/minecraft/${username}`,
        { timeout: 5000 }
      );

      if (response.data) {
        return {
          uuid: response.data.id,
          username: response.data.name,
          skinUrl: `https://crafatar.com/avatars/${response.data.id}?size=64`,
          headUrl: `https://crafatar.com/renders/head/${response.data.id}`,
        };
      }

      return null;
    } catch (error) {
      return null;
    }
  }
}

